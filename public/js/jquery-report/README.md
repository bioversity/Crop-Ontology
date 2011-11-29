# jquery-report

Allows you to visualize your JSON data as an HTML Table

# Usage

It takes an array of JSON objects. It only goes **one** level deep. If you have objects inside objects it won't work. The **keys** of the object represent the name of the columns in the tabular layout.

    $("table").report([
      {"type": "address", "name": "Fred", "mobile": "555-0001"},
      {"type": "address", "name": "Barney", "mobile": "555-0002"},
      {"type": "address", "name": "Audrey", "mobile": "555-0003", "city": "Minneapolis"},
      {"type": "address", "name": "Barney", "mobile": "555-0004", "city": "Georgia, Funksville", "sex": "male"},
      {"type": "address", "city": "Idaho", "sex": "female", "name": "Alissa"},
      {"type": "address", "sex": "female", "name": "Dardia"}  
    ]);

# Demo

[DEMONSTRATION](http://lmatteis.github.com/jquery-report/)
