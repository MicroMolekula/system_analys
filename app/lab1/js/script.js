const canvas = document.getElementById("canv");
const btnNode = document.getElementById("drawNode");
const btnLink = document.getElementById("drawLink");
const context = canvas.getContext("2d");
const w = canvas.width
const h = canvas.height
let mouse = {x: -1, y: -1};
let countNode = 1;
let nodes = [];
let links = [];
let drawNode = true;
const nodeR = 20;
let countClick = false;

class Node {
    x;
    y;
    num;
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

    eqXY(p1, p2) {
        let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return {x: 20 * Math.cos(angle - Math.PI / 6), y: 20 * Math.sin(angle - Math.PI / 6)};
    }

    createPath() {
        if(this.nodeStart.num === this.nodeEnd.num){
            const fig = new Path2D();
            fig.arc(this.nodeStart.x, this.nodeStart.y+20, 20, 11*Math.PI/6, 7*Math.PI/6, false);
            return fig;
        }

        const fig = new Path2D();
        //let start = this.eqXY(this.nodeStart.x, this.nodeStart.y, this.nodeEnd.x, this.nodeEnd.y);
        //console.log(start);
        let p1 = {x: this.nodeStart.x, y: this.nodeStart.y};
        let p2 = {x: this.nodeEnd.x, y: this.nodeEnd.y};

        let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        fig.moveTo(this.nodeStart.x, this.nodeStart.y);
        fig.lineTo(this.nodeEnd.x , this.nodeEnd.y);
        context.moveTo(this.nodeEnd.x - 20 * Math.cos(angle - Math.PI / 6), this.nodeEnd.y - 20 * Math.sin(angle - Math.PI / 6));
        context.lineTo(this.nodeEnd.x, this.nodeEnd.y);
        context.lineTo(this.nodeEnd.x - 20 * Math.cos(angle + Math.PI / 6), 20 * Math.sin(angle + Math.PI / 6));
        fig.closePath();
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
            console.log(link.nodeStart, link.nodeEnd);
        }
        else if(countClick && checkClick(mouse)) {
            links[links.length-1].initNodeEnd();
            if (links[links.length-1].nodeEnd !== undefined || links[links.length-1].nodeStart !== undefined) {
                let linkPath = links[links.length - 1].createPath();
                context.stroke(linkPath);
            }
            console.log(links);
        }
    }
});

