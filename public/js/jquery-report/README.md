# jquery-report

Allows you to visualize your JSON data as an HTML Table

# Usage

It takes an array of JSON objects. It only goes **one** level deep. If you have objects inside objects it won't work. The **keys** of the object represent the name of the columns in the tabular layout.

    $("table").report([
      {
        "foo":"bar",
        "cazzo": "ciao"
      },
      {"motherfucker":"kitchen"},
      {"motherfucker":"food"},
      {"perl":"food"},
      {"motherfucker":"apple"},
      {"motherfucker":"cacca"},
      {"foo":"minchia"},
      {"cazzo":"minchia"}
    ]);
