-- Script para configurar usuarios de autenticación en Supabase
-- Este script crea usuarios en auth.users para que puedan hacer login

-- Insertar usuarios en auth.users
-- Nota: Estos UUIDs deben coincidir con los de user_profiles

-- 1. Admin
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'admin@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Administrador Kary", "role": "admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Estudiante
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'estudiante@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'estudiante@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "María García Estudiante", "role": "student"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 3. Profesor
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'profesor@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'profesor@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Carlos López Profesor", "role": "teacher"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 4. Padre
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'padre@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'padre@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ana Rodríguez Madre", "role": "parent"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 5. Psicopedagogo
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'psicopedagogo@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'psicopedagogo@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. Luis Martínez Psicopedagogo", "role": "psychopedagogue"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 6. Directivo
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    (SELECT id FROM user_profiles WHERE email = 'directivo@kary.com'),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'directivo@kary.com',
    crypt('kary123456', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Lic. Patricia Silva Directora", "role": "directive"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Verificar que los usuarios se crearon
SELECT 
    u.email,
    u.full_name,
    u.role,
    CASE WHEN au.id IS NOT NULL THEN 'Auth OK' ELSE 'Auth Missing' END as auth_status
FROM user_profiles u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email IN (
    'admin@kary.com',
    'estudiante@kary.com', 
    'profesor@kary.com',
    'padre@kary.com',
    'psicopedagogo@kary.com',
    'directivo@kary.com'
)
ORDER BY u.role;
