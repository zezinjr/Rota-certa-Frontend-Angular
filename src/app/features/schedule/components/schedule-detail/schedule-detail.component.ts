import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScheduleService } from '../../service/schedule.service';
import { Schedule } from '../../models/schedule';

@Component({
  selector: 'app-schedule-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule],
  templateUrl: './schedule-detail.component.html',
  styleUrl: './schedule-detail.component.scss'
})
export class ScheduleDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isEdit = false;
  scheduleId: number | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      company: [null, Validators.required],
      weekdays: ['MON,TUE,WED,THU,FRI', Validators.required],
      time: ['', Validators.required],
      is_active: [true]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.scheduleId = +id;
      this.loadSchedule(this.scheduleId);
    }
  }

  loadSchedule(id: number): void {
    this.scheduleService.getById(id).subscribe({
      next: (schedule) => this.form.patchValue({
        ...schedule,
        weekdays: schedule.weekdays?.join(',') ?? ''
      }),
      error: (err) => console.error('Erro ao carregar horário:', err)
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const data: Partial<Schedule> = {
      ...this.form.value,
      company: Number(this.form.value.company),
      weekdays: String(this.form.value.weekdays).split(',').map(day => day.trim()).filter(Boolean)
    };
    const request$ = this.isEdit && this.scheduleId
      ? this.scheduleService.patch(this.scheduleId, data)
      : this.scheduleService.create(data);

    request$.subscribe({
      next: () => this.router.navigate(['/horarios']),
      error: (err) => console.error('Erro ao salvar horário:', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/horarios']);
  }
}
