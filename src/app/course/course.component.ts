import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { merge, fromEvent, pipe, throwError } from "rxjs";
import { Lesson } from '../model/lesson';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course: Course;

  lessons: Array<Lesson> = [];

  loading: boolean = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  selection: SelectionModel<Lesson> = new SelectionModel<Lesson>(true, []);

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }

  displayedColumns = ['select', 'seqNo', "description", "duration"]

  expandedLesson: Lesson = null;

  ngOnInit() {

    this.course = this.route.snapshot.data["course"];

    this.loadLessonsPage();
  }

  loadLessonsPage() {
    this.loading = true;

    this.coursesService.findLessons(
      this.course.id,
      this.sort?.direction,
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 3,
      this.sort?.active ?? "seqNo"
    )
      .pipe(
        tap(lessons => this.lessons = lessons),
        catchError(err => {
          console.log("Error loading lessons ", err);
          alert("Error loading lessons.");
          return throwError(err);
        }),
        finalize(() => this.loading = false)
      ).subscribe();
  }

  onToggleLesson(lesson: Lesson): void {
    if (lesson == this.expandedLesson) {
      this.expandedLesson = null;
    } else {
      this.expandedLesson = lesson;
    }
  }

  onLessonToggled(lesson: Lesson): void {
    this.selection.toggle(lesson);
    console.log(this.selection.selected)
  }

  isAllSelected(): boolean {
    return this.selection.selected?.length == this.lessons?.length;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.lessons);
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange,
      this.paginator.page
    ).pipe(
      tap(() => this.loadLessonsPage())
    ).subscribe();
  }

}
