import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  history: string[] = [];

  previous: [string, number] = ["", NaN];

  period: string = "."

  operators_arr: string[] = ["+" , "-" , "/" , "*" ];

  input: string = "";

  numbers: string[] = [...Array(10).keys()].map(item => item.toString())

  total: number = 0;

  constructor(public renderer: Renderer2)
  {
    this.numbers.push(this.numbers.shift()!);
  }

  calculate(): number
  {
    if (this.input == "") return NaN;

    type operators_type = "+" | "-" | "/" | "*" ;
    let operators_regex: RegExp = /\+|-|\/|\*/;
    let operators: operators_type[] = this.input.split("").filter(item => this.operators_arr.includes(item)).map(item => item as operators_type);
    let strings = this.input.split(operators_regex)
    let numbers: number[] = strings.map(item => Number(item));

    strings.forEach((item, i) => {
      if (item == "Ans")
      {
        numbers[i] = this.total;
      }
      else if (item == "" && operators[i] == "-" && strings[i+1] != "")
      {
        numbers.splice(i, 1);
        operators.splice(i, 1);
        strings.splice(i, 1);
        numbers[i] = numbers[i]*-1;
        strings[i] = numbers[i].toString();
      }
    });

    if (numbers.some(item => isNaN(item)))
    {
      this.input = "Error: " + strings.find(item => isNaN(Number(item)))! + " is not a number";
    }
    else if (strings.some(item => item == ""))
    {
      this.input = "Error: Too many operators (+,-,/,*) and not enough operands (numbers)";
    }
    else if (numbers.length == 1 && operators.length == 0)
    {
      if (strings[0] == "Ans") this.input = numbers[0].toString();

      return NaN;
    }
    else
    {
      let eq: string = "";
      for (let i = 0; i < numbers.length-1; i++)
      {
        eq += numbers[i].toString() + " " + operators[i] + " ";
      }
      eq += numbers[numbers.length-1];

      this.total = numbers.shift()!;
      let num: number = NaN;
      for (const operand of operators)
      {
        num = numbers.shift()!
        switch(operand)
        {
          case "+":
            this.total += num
            break;
          case "-":
            this.total -= num
            break;
          case "*":
            this.total *= num
            break;
          case "/":
            if (num == 0) this.total = NaN;
            else this.total /= num
            break;
        }
      }

      this.input = this.total.toString();
      eq += " = " + this.input;
      this.history.push(eq);
      this.previous = [operators.pop()!, num]
      return this.total;
    }

    return NaN;
  }

  repeat(): void
  {
    if (this.previous[0] != "")
    {
      this.input = this.total.toString() + this.previous[0] + this.previous[1].toString();
      this.calculate();
    }
  }

  reset(): void
  {
    this.input = "";
    this.total = 0;
    this.history = [];
    this.previous = ["", NaN];
  }

  clear(): void
  {
    this.input = "";
  }

  addInput(event: Event): void
  {
    let button = event.target as HTMLButtonElement;
    this.input += button.innerText;
  }

  ngOnInit(): void {
  }
}
