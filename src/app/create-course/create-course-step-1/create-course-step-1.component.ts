import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

const SAMPLE_TEXT = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it";

@Component({
  selector: "create-course-step-1",
  templateUrl: "create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(1990, 0, 1), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: [SAMPLE_TEXT, [Validators.required, Validators.minLength(3)]]
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();
    if (view == 'month') {
      return (date == 1) ? 'highlight-date' : "";
    }

    return "";
  }

  constructor(private fb: FormBuilder) {

  }

  get courseTitle(): AbstractControl {
    return this.form.controls['title'];
  }

}
