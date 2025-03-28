export class Person {
  personId: number;
  name?: string;
  age?: number;

  constructor(personId: number, name: string, age: number) {
    this.personId = personId;
    this.name = name;
    this.age = age;
  }
}
