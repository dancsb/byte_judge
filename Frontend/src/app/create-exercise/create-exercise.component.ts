import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../exercise.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-create-exercise',
  standalone: true,
  imports: [ NavbarComponent, CommonModule, ReactiveFormsModule ],
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
})
export class CreateExerciseComponent {
  exerciseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.exerciseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      timeLimit: [null, [Validators.required, Validators.min(0)]],
      memoryLimitKB: [null, [Validators.required, Validators.min(1)]],
      testCases: this.fb.array([
        this.createTestCase(),
        this.createTestCase()
      ])
    });
  }

  get testCases(): FormArray {
    return this.exerciseForm.get('testCases') as FormArray;
  }

  createTestCase(): FormGroup {
    return this.fb.group({
      input: ['', Validators.required],
      output: ['', Validators.required]
    });
  }

  addTestCase(): void {
    this.testCases.push(this.createTestCase());
  }

  removeTestCase(index: number): void {
    if (this.testCases.length > 2) {
      this.testCases.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      this.exerciseService.createExercise(this.exerciseForm.value).then(() => {
        this.router.navigate(['/landing']);
      }).catch(error => {
        console.error('Failed to create exercise:', error);
      });
    }
  }
}
