import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../exercise.service';
import { CommonModule } from '@angular/common';
import { SubmissionService } from '../submission.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exercise-details',
  standalone: true,
  imports: [ NavbarComponent, NgFor, CommonModule],
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss']
})
export class ExerciseDetailsComponent {
  exercise: any;
  exerciseService: ExerciseService = inject(ExerciseService);
  submissionForm: FormGroup;

  constructor(private route: ActivatedRoute, private submissionService: SubmissionService, private fb: FormBuilder, private toastr: ToastrService) {
    const exerciseId = this.route.snapshot.paramMap.get('id');
    if (exerciseId) {
      this.loadExerciseDetails(exerciseId);
    }

    this.submissionForm = this.fb.group({
      language: ['C'],
      file: [null]
    });
  }

  private async loadExerciseDetails(id: string) {
    try {
      this.exercise = await this.exerciseService.getExerciseById(id);
    } catch (error) {
      console.error('Failed to load exercise details:', error);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.submissionForm.patchValue({ file });
    }
  }

  async submitSolution() {
    const file: File = this.submissionForm.get('file')?.value;
    const exerciseId = this.exercise.id;

    if (!file) {
      console.error('No file selected for submission.');
      return;
    }

    try {
      const sourceCode = await file.text(); // Read file content as text
      const response = await this.submissionService.submitSolution(exerciseId, sourceCode).toPromise();
      if (response && response.submissionId) {
        const submissionId = response.submissionId;
        this.toastr.success(`Submission successful! ID: ${submissionId}`, 'Success');
      } else {
        console.error('Invalid response from submission service.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
    }
  }
}
