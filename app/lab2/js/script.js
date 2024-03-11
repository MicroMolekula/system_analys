const canvas = document.getElementById("canv");
const btnNode = document.getElementById("drawNode");
const btnLink = document.getElementById("drawLink");
const btnGL = document.getElementById("btnGL");
const btnGR = document.getElementById("btnGR");
const btnSortLevel = document.getElementById("sortLevel");
const divOut = document.getElementById("out");
const context = canvas.getContext("2d");
let mouse = {x: -1, y: -1};
let countNode = 1;
let nodes = [];
let links = [];
let drawNode = true;
const nodeR = 20;
let countClick = false;
let graph = null;

class Graph {
    nodes;
    links;
    GL;
    GR;
    B;

    constructor(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }

    sortLevel(){
        if(this.GL === undefined) {
            this.initGL();
        }
        let tmpGL = Object.assign({}, this.GL);
        let countNewNum = 1;
        while (Object.keys(tmpGL).length !== 0){
            let level = [];
            for (let key in tmpGL){
                if(tmpGL[key].length === 0){
                    this.nodes[Number(key)].newNum = countNewNum;
                    countNewNum++;
                    delete tmpGL[key];
                    for (let node in tmpGL){
                        for(let i = 0; i < tmpGL[node].length; i++){
                            if(tmpGL[node][i] === (Number(key)+1)){
                                tmpGL[node].splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
        console.log(this.GL);
    }

    sortNodes(){
        for (let j = this.nodes.length - 1; j > 0; j--) {
            for (let i = 0; i < j; i++) {
                if (this.nodes[i].num > this.nodes[i + 1].num) {
                    let temp = this.nodes[i];
                    this.nodes[i] = this.nodes[i + 1];
                    this.nodes[i + 1] = temp;
                }
            }
        }
    }

    reinitGraph(){
        for(let k = 0; k < this.nodes.length; k++){
            let tmp = this.nodes[k].num;
            this.nodes[k].num = this.nodes[k].newNum;
            this.nodes[k].newNum = tmp;
        }
    }

    reprintGraph(){
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000000';
        for(let i = 0; i < this.nodes.length; i++){
            let nodePath = this.nodes[i].createPath();
            context.stroke(nodePath);
        }
        for(let j = 0; j < this.links.length; j++){
            let linkPath = this.links[j].createPath();
            context.stroke(linkPath);
        }
    }

    initGL() {
        this.GL = [];
        for (let i = 0; i < this.nodes.length; i++){
            let tmp = [];
            for (let j = 0; j < this.links.length; j++){
                if (this.nodes[i] === this.links[j].nodeEnd){
                    tmp.push(this.links[j].nodeStart.num);
                }
            }
            this.GL.push(tmp);
        }
        return this.GL;
    }

    initGR() {
        if (this.GL !== undefined) {
            this.GR = [];
            for (let i = 0; i < this.GL.length; i++) {
                let tmp = [];
                for (let j = 0; j < this.GL.length; j++) {
                    for (let k = 0; k < this.GL[j].length; k++) {
                        if ((i + 1) === this.GL[j][k]) {
                            tmp.push(j + 1);
                        }
                    }
                }
                this.GR.push(tmp);
            }
            return this.GR;
        }
    }

    initB() {
        if (this.GL === undefined) {
            return;
        }
        let countLinks = 0
        this.B = [];
        for (let c = 0; c < this.GL.length; c++) {
            countLinks += this.GL[c].length;
        }
        for (let i = 0; i < this.GL.length; i++) {
            let tmp = [];
            for (let j = 0; j < countLinks; j++) {
                tmp.push(0);
            }
            this.B.push(tmp);
        }
        let indexLinks = 0;
        for (let i = 0; i < this.GL.length; i++) {
            for (let j = 0; j < this.GL[i].length; j++) {
                this.B[i][indexLinks] -= 1;
                this.B[this.GL[i][j] - 1][indexLinks] += 1;
                indexLinks += 1;
            }
        }
        return this.B;
    }
}

class Node {
    x;
    y;
    num;
    newNum;
    constructor(x, y, num) {
        this.x = x;
        this.y = y;
        this.num = num;
    }

    createPath(){
        const fig = new Path2D();
        fig.arc(this.x, this.y, nodeR, 0, Math.PI*2);
        fig.closePath();
        context.beginPath();
        context.font = "22px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.num.toString(), this.x, this.y);
        context.closePath();
        return fig;
    }
}

class Link {
    nodeStart;
    nodeEnd;

    initNodeStart() {
        let nodeIndex = collisionNode(mouse);
        if(nodeIndex) {
            this.nodeStart = nodes[nodeIndex-1];
        }
    }

    initNodeEnd() {
        let nodeIndex = collisionNode(mouse);
        if(nodeIndex) {
            this.nodeEnd = nodes[nodeIndex-1];
        }
    }

    drawLineWithArrow(p1, p2, path) {
        let arrow_size = 15;
        let v = {
            x: p2.x - p1.x,
            y: -(p2.y - p1.y)
        }
        let lenV = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
        path.moveTo(p1.x, p1.y);
        path.lineTo(p2.x, p2.y);
        let angle = Math.atan2(-(p2.y - p1.y), p2.x - p1.x);
        let angle1 = Math.atan2(-(p1.y - p2.y), p1.x - p2.x);
        let dist = {x: -55*Math.cos(angle), y: 55*Math.sin(angle)};
        p1 = {x:p1.x - ((lenV-20)*Math.cos(angle1)), y: p1.y + ((lenV-20)*Math.sin(angle1))};
        let p2D = {x:p2.x + dist.x, y: p2.y + dist.y};
        let arrowP1 = {
            x: p2D.x + Math.sin(angle + Math.PI / 3) * arrow_size,
            y: p2D.y + Math.cos(angle + Math.PI / 3) * arrow_size
        };
        let arrowP2 = {
            x: p2D.x + Math.sin(angle + Math.PI - Math.PI / 3) * arrow_size,
            y: p2D.y + Math.cos(angle + Math.PI - Math.PI / 3) * arrow_size
        };
        path.moveTo(arrowP1.x, arrowP1.y);
        path.lineTo(p1.x, p1.y);
        path.lineTo(arrowP2.x, arrowP2.y);
        path.closePath();
        return path;
    }

    createPath() {
        if(this.nodeStart.num === this.nodeEnd.num){
            const fig = new Path2D();
            fig.arc(this.nodeStart.x, this.nodeStart.y+20, 20, 11*Math.PI/6, 7*Math.PI/6, false);
            return fig;
        }
        let fig = new Path2D();
        //let start = this.eqXY(this.nodeStart.x, this.nodeStart.y, this.nodeEnd.x, this.nodeEnd.y);
        //console.log(start);
        let p1 = {x: this.nodeStart.x, y: this.nodeStart.y};
        let p2 = {x: this.nodeEnd.x, y: this.nodeEnd.y};
        fig = this.drawLineWithArrow(p1, p2, fig);
        return fig;
    }
}

function collisionNode(mouse){
    for(let i = 0; i < nodes.length; i++){
        if(mouse.x <= nodes[i].x + nodeR && mouse.x >= nodes[i].x - nodeR && mouse.y <= nodes[i].y + nodeR && mouse.y >= nodes[i].y - nodeR){
            countClick = !countClick;
            return nodes[i].num;
        }
    }
    return false;
}

function checkClick(mouse) {
    for(let i = 0; i < nodes.length; i++){
        if(mouse.x <= nodes[i].x + nodeR && mouse.x >= nodes[i].x - nodeR && mouse.y <= nodes[i].y + nodeR && mouse.y >= nodes[i].y - nodeR){
            return true;
        }
    }
    return false;
}

btnNode.addEventListener("click", function (){
    drawNode = true;
});

btnLink.addEventListener("click", function (){
    drawNode = false;
});

btnGL.addEventListener("click", function (){
    if(graph === null){
        graph = new Graph(nodes, links);
    }
    graph.initGL();
    console.log(graph);
    let divGL = document.createElement('div');
    divGL.className = 'GL';
    divGL.innerHTML = "<p><b>GL:</b></p>";
    for (let i = 0; i < graph.GL.length; i++){
        let tmp = `<p>GL(${i+1}) = (`;
        for (let j = 0; j < graph.GL[i].length; j++){
            tmp += graph.GL[i].length - 1 !== j ? `${graph.GL[i][j]},` : `${graph.GL[i][j]}`;
        }
        tmp += `)</p>`;
        divGL.innerHTML += tmp;
    }
    divOut.appendChild(divGL);
});

btnGR.addEventListener("click", function (){
    if (graph != null){
        console.log("GR", graph.initGR());
        let divGR = document.createElement('div');
        divGR.className = 'GR';
        divGR.innerHTML = "<p><b>GR:</b></p>";
        for (let i = 0; i < graph.GR.length; i++){
            let tmp = `<p>GR(${i+1}) = (`;
            for (let j = 0; j < graph.GR[i].length; j++){
                tmp += graph.GR[i].length - 1 !== j ? `${graph.GR[i][j]},` : `${graph.GR[i][j]}`;
            }
            tmp += `)</p>`;
            divGR.innerHTML += tmp;
        }
        divOut.appendChild(divGR);
    }
});

btnSortLevel.addEventListener("click", function (){
    if(graph === null){
        graph = new Graph(nodes, links);
    }
    graph.sortLevel();
    graph.reinitGraph();
    graph.reprintGraph();
    graph.sortNodes();
    console.log(graph);
});

canvas.addEventListener("click", function (event){
    if (drawNode) {
        mouse.x = event.pageX - this.offsetLeft;
        mouse.y = event.pageY - this.offsetTop;
        let node = new Node(mouse.x, mouse.y, countNode);
        let nodePath = node.createPath();
        context.stroke(nodePath);
        nodes.push(node);
        countNode += 1;
        mouse = {x: -1, y: -1};
    }
    else {
        let link = new Link();
        mouse.x = event.pageX - this.offsetLeft;
        mouse.y = event.pageY - this.offsetTop;
        if(!countClick && checkClick(mouse)) {
            links.push(link);
            links[links.length-1].initNodeStart();
        }
        else if(countClick && checkClick(mouse)) {
            links[links.length-1].initNodeEnd();
            if (links[links.length-1].nodeEnd !== undefined || links[links.length-1].nodeStart !== undefined) {
                let linkPath = links[links.length - 1].createPath();
                context.stroke(linkPath);
            }
        }
    }
});
