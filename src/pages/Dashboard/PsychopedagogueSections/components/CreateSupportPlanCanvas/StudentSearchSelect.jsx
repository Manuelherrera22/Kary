import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';

const StudentSearchSelect = ({ students, value, onChange }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectedStudent = students.find((student) => student.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-800 border-slate-700 hover:bg-slate-700"
        >
          {selectedStudent ? selectedStudent.full_name : t('supportPlans.aiCanvas.selectStudentPlaceholder')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-slate-800 border-slate-700 text-white">
        <Command>
          <CommandInput placeholder={t('supportPlans.aiCanvas.selectStudentPlaceholder')} />
          <CommandEmpty>{t('supportPlans.aiCanvas.noStudentsFound')}</CommandEmpty>
          <CommandGroup>
            {students.map((student) => (
              <CommandItem
                key={student.id}
                value={`${student.full_name} ${student.id}`}
                onSelect={() => {
                  onChange(student.id === value ? '' : student.id);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value === student.id ? 'opacity-100' : 'opacity-0')} />
                {student.full_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StudentSearchSelect;