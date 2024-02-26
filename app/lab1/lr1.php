<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!--<script src="https://code.jquery.com/jquery-3.7.1.min.js"
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
            crossorigin="anonymous"></script>
    </script> -->
</head>
<body>
    <!--<form method="post">
        <input type="text" id="name" name="name"><br>
        <input type="text" id="surname" name="surname">
        <input type="submit" value="Submit">
    </form>-->
    <canvas id="canv"
            width="800"
            height="600"
            style="border: 1px solid black;">
    </canvas><br>
    <button id="drawNode">Нарисовать Вершину</button>
    <button id="drawLink">Соединить Вершины</button>
    <button id="btnGraph">Вывести граф</button>
    <script src="js/script.js">
        /*$(document).ready(function () {
            $("form").on('submit', function (event){
                event.preventDefault();
                $.post( "form.php", {name: $("#name").val(), surname: $("#surname").val()});
            });
        });*/
    </script>
</body>
</html>