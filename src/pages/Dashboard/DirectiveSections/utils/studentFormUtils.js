import { supabase } from '@/lib/supabaseClient';

export const createOrUpdateStudent = async (formData, existingStudentData) => {
  let studentUserId = existingStudentData?.id;

  if (!existingStudentData) { 
    let authUser = null;
    if (formData.email) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || `KaryStudent${Date.now().toString().slice(-4)}`, 
        options: {
          data: {
            full_name: formData.fullName,
            role: 'student' 
          }
        }
      });
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
            const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({ email: formData.email });
            if (userError || !users || users.length === 0) {
                throw new Error(`User with email ${formData.email} already exists but could not be retrieved.`);
            }
            authUser = users[0];
            studentUserId = authUser.id;
        } else {
            throw signUpError;
        }
      } else {
        authUser = signUpData.user;
        studentUserId = authUser.id;
      }
    }
    
    const profileData = {
      id: studentUserId, 
      full_name: formData.fullName,
      email: formData.email || null,
      role: 'student',
      grade: formData.grade,
      status: formData.status,
      admission_date: formData.admissionDate,
    };

    if (!studentUserId) { 
        const { data: insertedProfile, error: insertProfileError } = await supabase
            .from('user_profiles')
            .insert(profileData)
            .select('id')
            .single();
        if (insertProfileError) throw insertProfileError;
        studentUserId = insertedProfile.id;
    } else { 
        const { error: upsertProfileError } = await supabase
            .from('user_profiles')
            .upsert(profileData, { onConflict: 'id' });
        if (upsertProfileError) throw upsertProfileError;
    }

  } else { 
    const profileUpdateData = {
      full_name: formData.fullName,
      email: formData.email || null,
      grade: formData.grade,
      status: formData.status,
      admission_date: formData.admissionDate,
    };
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(profileUpdateData)
      .eq('id', studentUserId);
    if (updateError) throw updateError;

    if (formData.email && formData.email !== existingStudentData.email) {
        try {
            const { error: emailUpdateError } = await supabase.auth.admin.updateUserById(
                studentUserId,
                { email: formData.email }
            );
            if (emailUpdateError) console.warn("Error updating auth user email:", emailUpdateError.message);
        } catch (e) {
            console.warn("Exception updating auth user email:", e.message);
        }
    }
  }
  return studentUserId;
};

export const linkParentToStudent = async (parentId, studentUserId) => {
  await supabase
    .from('parent_child_mapping')
    .delete()
    .eq('child_user_id', studentUserId);

  const { error: mappingError } = await supabase
    .from('parent_child_mapping')
    .insert({ parent_user_id: parentId, child_user_id: studentUserId });
  if (mappingError) {
    console.error("Error in linkParentToStudent (insert new mapping):", mappingError);
    throw mappingError;
  }
};

export const unlinkParentFromStudent = async (studentUserId) => {
  const { error: deleteMappingError } = await supabase
    .from('parent_child_mapping')
    .delete()
    .eq('child_user_id', studentUserId);
  if (deleteMappingError) {
    console.warn("Error in unlinkParentFromStudent (delete mapping):", deleteMappingError.message);
  }
};