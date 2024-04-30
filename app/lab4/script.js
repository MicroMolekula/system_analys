const btnAdd = document.getElementById("add");
const btnDelete = document.getElementById("delete");
let matrix = document.getElementById("matrixD");
let output = document.getElementById("output");
let answer = document.getElementById("answer");
let size = 3;
let D = [];


function printOutput(arr){
    let count = 0;
    arr.forEach(function(el){
        let div = document.createElement('div');
        div.className = `Di`;
        div.innerHTML = `<p><b>D${count}:</b></p>`;
        let tmp = "";
        tmp += '<math><mtable>';
        tmp += '<mtr>';
        for (let k = 0; k <= el.length; k++){
            if(k === 0) tmp += `<mtd class="node1"></mtd>`;
            else tmp += `<mtd class="node1">${k}</mtd>`;
        }
        tmp += '</mtr>';
        for (let i = 0; i < el.length; i++) {
            tmp += '<mtr>';
            tmp += `<mtd class="node">${i+1}</mtd>`;

            for (let j = 0; j < el[i].length; j++){
                tmp += `<mtd>${el[i][j]}</mtd>`;
            }
            tmp += '</mtr>';
        }
        tmp += '</mtable></math>';
        div.innerHTML += tmp;
        output.appendChild(div);
        count++;
    });
    let div = document.createElement('div');
    div.className = `Di`;
    div.innerHTML = `<p><b>Ответ:</b></p>`;
    let tmp = "";
    tmp += '<math><mtable>';
    tmp += '<mtr>';
    for (let k = 0; k <= arr[arr.length-1].length; k++){
        if(k === 0) tmp += `<mtd class="node1"></mtd>`;
        else tmp += `<mtd class="node1">${k}</mtd>`;
    }
    tmp += '</mtr>';
    for (let i = 0; i < arr[arr.length-1].length; i++) {
        tmp += '<mtr>';
        tmp += `<mtd class="node">${i+1}</mtd>`;

        for (let j = 0; j < arr[arr.length-1][i].length; j++){
            tmp += `<mtd>${arr[arr.length-1][i][j]}</mtd>`;
        }
        tmp += '</mtr>';
    }
    tmp += '</mtable></math>';
    div.innerHTML += tmp;
    answer.appendChild(div);
    count++;
}

function createArr(n){
    let arr = [];
    for (let i = 0; i < n; i++){
        let tmp = [];
        for(let j = 0; j < n; j++){
            tmp.push(0);
        }
        arr.push(tmp);
    }
    return arr;
}

function dancig(input) {
    D = [input];
    for(let i = 0; i < D[0].length; i++){
        for(let j = 0; j < D[0].length; j++){
            if(i !== j){
                if(D[0][i][j] === 0){
                    D[0][i][j] = Infinity;
                }
            }
        }
    }
    for(let m = 1; m <= D[0].length; m++){
        let d = createArr(m);
        for(let c = 0; c < m - 1; c++){
            let tmp1 = [];
            let tmp2 = [];
            for(let k = 0; k < m - 1; k++){
                tmp1.push(D[0][m-1][k] + D[m-1][k][c]);
                tmp2.push(D[m-1][c][k] + D[0][k][m-1]);
            }
            d[m-1][c] = Math.min.apply(null, tmp1);
            d[c][m-1] = Math.min.apply(null, tmp2);
        }
        for(let i = 0; i < m-1; i++){
            for(let j = 0; j < m-1; j++){
                if(i === j){
                    d[i][j] = 0;
                }
                else if(i !== m - 2 || j !== m - 2){
                    d[i][j] = Math.min(d[i][m-1] + d[m-1][j], D[m-1][i][j]);
                }
            }
        }
        D.push(d);
    }
    console.log(D);
    return D;
}


btnAdd.addEventListener("click", function() {
    size += 1;
    matrix.childNodes[1].childNodes.forEach(function(el){
        if(el.nodeName !== '#text' && el.id !== "htop"){
            let td = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.id = `${el.id[1]}_${size}`;
            td.appendChild(input);
            el.appendChild(td);
        }
        if(el.id === "htop"){
            let td = document.createElement("td");
            td.className = `htop`;
            td.id = `${size}`
            td.textContent = `${size}`;
            el.appendChild(td);
        }
    });
    let tmp = document.createElement("tr");
    tmp.id = `r${size}`;
    let tdIndex = document.createElement("td");
    tdIndex.textContent = `${size}`;
    tmp.appendChild(tdIndex);
    for (let i = 1; i <= size; i++){
        let tdV = document.createElement("td");
        let inputV = document.createElement("input");
        inputV.type = "text";
        inputV.id = `${size}_${i}`;
        tdV.appendChild(inputV);
        tmp.appendChild(tdV);
    }
    Array.from(matrix.childNodes)[1].appendChild(tmp);
});


btnMain.addEventListener("click", function(){
    matrix = document.getElementById("matrixD");
    D = [];
    matrix.childNodes[1].childNodes.forEach(function(el){
        if(el.nodeName !== '#text' && el.id !== "htop"){
            let tmp = [];
            for(let i = 1; i < el.children.length; i++){
                tmp.push(Number(el.children[i].children[0].value));
            }
            D.push(tmp);
        }
    });
    printOutput(dancig(D));
});


btnDelete.addEventListener("click", function(){
    matrix.childNodes[1].childNodes.forEach(function(el){
        if(el.nodeName !== '#text' && el.id !== "htop"){
            for(let i = 1; i < el.children.length; i++){
                if(el.children[i].children[0].id[2] == size){
                    el.children[i].remove();
                }
            }
        }
        if(el.id === `r${size}`){
            el.remove();
        }
        if(el.id === "htop") {
            for(let i = 1; i < el.children.length; i++){
                if(el.children[i].id === `${size}`){
                    el.children[i].remove();
                }
            }
        }
    });
    size = size === 0 ? size = 0 : size - 1;
});