import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add two integers', () => {
    component.input = "1+1";
    component.calculate();
    expect(component.input).toEqual("2");
  });

  it('should subtract two integers', () => {
    component.input = "1-1";
    component.calculate();
    expect(component.input).toEqual("0");
  });

  it('should multiply two integers', () => {
    component.input = "2*4";
    component.calculate();
    expect(component.input).toEqual("8");
  });

  it('should divide two integers', () => {
    component.input = "10/2";
    component.calculate();
    expect(component.input).toEqual("5");
  });

  it('should add two floats', () => {
    component.input = "1.2+3.4";
    component.calculate();
    expect(component.input).toEqual("4.6");
  });

  it('should subtract two floats', () => {
    component.input = "1.2-2.4";
    component.calculate();
    expect(component.input).toEqual("-1.2");
  });

  it('should multiply two floats', () => {
    component.input = "2.5*2.1";
    component.calculate();
    expect(component.input).toEqual("5.25");
  });

  it('should divide two floats', () => {
    component.input = "11.25/2.5";
    component.calculate();
    expect(component.input).toEqual("4.5");
  });

  it('should return "NaN" when dividing by 0', () => {
    component.input = "1/0";
    component.calculate();
    expect(component.input).toEqual("NaN");
  });

  it('should return "Error: ..." if input contains something that is not a number where a number is expected', () => {
    component.input = "lettuce*dog";
    component.calculate();
    expect(component.input).toEqual("Error: lettuce is not a number");
  });

  it('should return "Error: ..." if input contains an incorrectly written number', () => {
    component.input = "1.1.1*2";
    component.calculate();
    expect(component.input).toEqual("Error: 1.1.1 is not a number");
  });

  it('should return "Error: ..." if input contains too many operators with insuficient operands', () => {
    component.input = "1---1";
    component.calculate();
    expect(component.input).toEqual("Error: Too many operators (+,-,/,*) and not enough operands (numbers)");
  });

  it('should return the original number if only one number is given', () => {
    component.input = "99";
    component.calculate();
    expect(component.input).toEqual("99");
  });

  it('should have buttons that add their inner text to the input', () => {
    component.input = "";
    let button = component.renderer.createElement("button")
    button.innerText = "TEST";
    button.addEventListener("click", (evt: Event) => {component.addInput(evt)});
    button.click();
    expect(component.input).toEqual("TEST");
  });

  it('should be able to clear all input', () => {
    component.input = "JUnKhErE";
    component.clear();
    expect(component.input).toEqual("");
  });

  it('should be able to clear all input and other stored numbers', () => {
    component.input = "JUnKhErE";
    component.total = 100;
    component.history = ["50 + 50 = 100"];
    component.previous = ["+", 50];
    component.reset();
    expect(component.input).toEqual("");
    expect(component.total).toEqual(0);
    expect(component.history).toEqual([]);
    expect(component.previous).toEqual(["", NaN]);
  });

  it('should be able to reference the previous total', () => {
    component.total = 100;
    component.input = "Ans+1";
    component.calculate();
    expect(component.input).toEqual("101");
  });

  it('should have 0 set as the previous total by default', () => {
    component.input = "Ans+1";
    component.calculate();
    expect(component.input).toEqual("1");
  });

  it('should be able to convert "Ans" to the current total and set it as the input', () => {
    component.input = "Ans";
    component.calculate();
    expect(component.input).toEqual("0");
  });

  it('should be able to repeat operations', () => {
    component.total = 100;
    component.previous = ["+", 50]
    component.input = "";
    component.repeat();
    expect(component.input).toEqual("150");
  });

  it('should not do anything if a repeat operation is attempted when no operations are saved', () => {
    component.repeat();
    expect(component.input).toEqual("");
  });

  it('should handle negative numbers', () => {
    component.input = "-2+1"
    component.calculate();
    expect(component.input).toEqual("-1");
    component.input = "Ans*2"
    component.calculate();
    expect(component.input).toEqual("-2");
    component.input = "Ans/-2"
    component.calculate();
    expect(component.input).toEqual("1");
    component.repeat();
    expect(component.input).toEqual("-0.5");
    component.repeat();
    expect(component.input).toEqual("0.25");
  });

  it('should be able to handle multiple operators', () => {
    component.input = "1+1+1+1+1"
    component.calculate();
    expect(component.input).toEqual((1+1+1+1+1).toString());
    component.input = "1--1-2--3--7"
    component.calculate();
    expect(component.input).toEqual((1-(-1)-2-(-3)-(-7)).toString());
    component.input = "1+2*3/4-9"
    component.calculate();
    expect(component.input).toEqual(((((1+2)*3)/4)-9).toString());
  });
});
