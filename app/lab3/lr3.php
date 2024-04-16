<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>ЛР3</title>
    <style>
        table, th, td {
            border: 0;
        }
        td {
            padding: 7px;
        }
        .node {
            border-right: 1px solid black;
        }
        .node1 {
            border-bottom: 1px solid black;
        }
    </style>
</head>
<body>
    <div class="main" style="display: flex; flex-direction: row">
        <div class="canvas">
            <canvas id="canv"
                    width="800"
                    height="600"
                    style="border: 1px solid black;">
            </canvas><br>
            <button id="drawNode">Нарисовать Вершину</button>
            <button id="drawLink">Соединить Вершины</button><br><br>
            <button id="btnGL">Вывести множество левых инциденций</button>
            <button id="btnSubGraph">Найти подграфы</button>
        </div>
        <div class="output" id="out" style="margin-left: 50px;">
        </div>
    </div>
    <script src="js/script.js">
    </script>
</body>
</html>