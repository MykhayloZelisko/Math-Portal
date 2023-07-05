import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableHeaderInterface
} from '../../../../../shared/models/interfaces/table-header.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UsersTableInterface } from '../../../../../shared/models/interfaces/users-table.interface';
import { SortingType } from '../../../../../shared/models/types/sorting.type';
import { USERS_TABLE_HEADER } from '../../../../../shared/models/constants/user-table-header';
import {
  TableContentPositionType
} from '../../../../../shared/models/types/table-content-position.type';
import {
  HeaderContentPositionType
} from '../../../../../shared/models/types/header-content-position.type';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  PaginatorConfigInterface
} from '../../../../../shared/models/interfaces/paginator-config.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  UsersTableColumnNameEnum
} from '../../../../../shared/models/enums/users-table-column-name.enum';
import { SortColumnInterface } from '../../../../../shared/models/interfaces/sort-column.interface';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, NgxPaginationModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent implements OnInit, OnChanges {
  @Input()
  public tableContent!: UsersTableInterface;

  public sortParams: { [key: string]: SortingType } = {};

  @Input()
  public paginatorConfig!: PaginatorConfigInterface;

  // @Input() public clearCurrentPageField = false;

  @Output()
  public changePaginatorConfig: EventEmitter<PaginatorConfigInterface> = new EventEmitter<PaginatorConfigInterface>();

  @Output()
  public sortColumn: EventEmitter<SortColumnInterface> = new EventEmitter<SortColumnInterface>();

  // @Output()
  // public clearPageControl: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public isPaginatorInit = false;

  public rowsPerPage: number[] = [10, 20, 50, 100];

  public pageArray = new Array(1);

  public usersTableHeader: TableHeaderInterface[] = USERS_TABLE_HEADER;

  public paginationForm!: FormGroup;

  public constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.initSortParams();
    this.initPaginationForm();
  }

  public ngOnChanges(): void {
    if (this.tableContent && !this.isPaginatorInit) {
      this.initPaginator();
    }
  //   if (this.clearCurrentPageField) {
  //     this.paginationForm.controls['currentPage'].setValue(1);
  //     this.clearPageControl.emit(false);
  //   }
  }

  public onSortColumn(columnName: UsersTableColumnNameEnum): void {
    switch (this.sortParams[columnName]) {
    case 'default':
      this.sortParams[columnName] = 'asc';
      break;
    case 'asc':
      this.sortParams[columnName] = 'desc';
      break;
    case 'desc':
      this.sortParams[columnName] = 'default';
      break;
    default:
      break;
    }
    this.sortColumn.emit({columnName: columnName, sorting: this.sortParams[columnName]});
    this.paginationForm.controls['currentPage'].setValue(1);
  }

  private initSortParams(): void {
    this.usersTableHeader.forEach((headerItem: TableHeaderInterface) => {
      this.sortParams[headerItem.columnName] = headerItem.sorting;
    });
  }

  public getHeaderStyle(headerItem: TableHeaderInterface): {
    [key: string]: HeaderContentPositionType;
  } {
    return {
      'justify-content': headerItem.headerContentPosition,
    };
  }

  public getContentPosition(index: number): {
    [key: string]: TableContentPositionType;
  } {
    return {
      'text-align': this.usersTableHeader[index].tableContentPosition,
    };
  }

  public onPageChange(pageNumber: number) {
    const currentPage = pageNumber;
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage,
    };
    this.paginationForm.controls['currentPage'].setValue(pageNumber);
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }

  private initPaginationForm(): void {
    this.paginationForm = this.fb.group({
      pageSize: [this.rowsPerPage[0]],
      currentPage: [1],
    });
  }

  private initPaginator(): void {
    this.paginatorConfig = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.tableContent.total,
    };
    this.pageArray = new Array(
      Math.ceil(
        this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage,
      ),
    );
    this.isPaginatorInit = true;
    this.cdr.detectChanges();
  }

  public updatePageSize() {
    const itemsPerPage = this.paginationForm.controls['pageSize'].value;
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage: 1,
      itemsPerPage,
    };
    this.paginationForm.controls['currentPage'].setValue(1);
    this.pageArray = new Array(
      Math.ceil(
        this.paginatorConfig.totalItems / this.paginatorConfig.itemsPerPage,
      ),
    );
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }

  public updateCurrentPage(): void {
    const currentPage = this.paginationForm.controls['currentPage'].value;
    this.paginatorConfig = {
      ...this.paginatorConfig,
      currentPage,
    };
    this.changePaginatorConfig.emit(this.paginatorConfig);
  }
}
