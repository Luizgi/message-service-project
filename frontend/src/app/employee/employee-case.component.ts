import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'case-app',
  templateUrl: './employee-case.component.ts'
})
export class EmployeeCaseComponent {
  @Input() myName: string = '';
  @Output() mynameChange = new EventEmitter<string>();

  changeCase(val: string){
    if(val == 'upper'){
      this.myName = this.myName.toUpperCase();
    } else {
      this.myName = this.myName.toLowerCase();
    }
    this.mynameChange.emit(this.myName);
  }
}
