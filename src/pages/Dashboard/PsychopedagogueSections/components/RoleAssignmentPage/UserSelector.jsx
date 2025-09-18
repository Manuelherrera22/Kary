import React, { useState, useEffect, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

const UserSelector = ({ value, onSelect, placeholder, filterRole, excludeIds = [] }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('user_profiles').select('id, full_name, email, role');
      
      if (filterRole) {
        query = query.eq('role', filterRole);
      }
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('full_name').limit(20);

      if (error) throw error;

      const availableUsers = data.filter(user => !excludeIds.includes(user.id));
      setUsers(availableUsers.map(user => ({
        value: user.id,
        label: `${user.full_name || t('common.notSpecified')} (${user.email || t('common.notSpecified')})`,
        role: user.role,
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filterRole, searchTerm, t, excludeIds]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
        fetchUsers();
    }, 300); 
    return () => clearTimeout(debounceFetch);
  }, [fetchUsers]);

  const selectedUser = users.find(user => user.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200"
        >
          {selectedUser ? selectedUser.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-slate-800 border-slate-700 text-slate-200">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={t('assignments.searchUser')} 
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-slate-700 focus:border-pink-500"
          />
          <CommandList>
            {loading && (
              <div className="p-2 text-center flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('assignments.loadingUsers')}
              </div>
            )}
            {!loading && users.length === 0 && (
              <CommandEmpty>{t('assignments.noUserFound')}</CommandEmpty>
            )}
            {!loading && users.length > 0 && (
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.value}
                    value={user.label} 
                    onSelect={() => {
                      onSelect(user.value);
                      setOpen(false);
                    }}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserSelector;