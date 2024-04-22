const btnAdd = document.getElementById("add");
const btnDelete = document.getElementById("delete");
let matrix = document.getElementById("matrixD");
let size = 3;
let D = [];

btnAdd.addEventListener("click", function() {
    size += 1;
    console.log(matrix.childNodes[1].childNodes);
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
            td.className = "htop";
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
    console.log(D);
});

