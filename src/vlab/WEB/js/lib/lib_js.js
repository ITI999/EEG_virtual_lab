$(document).ready(function(){
    //Скрыть PopUp при загрузке страницы
    PopUpHide();
});
//Функция отображения PopUp
function PopUpShow(){
    $("#popup1").show();
}
//Функция скрытия PopUp
function PopUpHide(){
    $("#popup1").hide();
}

function graphButtonClick(){
    event.preventDefault();
    let graphDiv = document.getElementById('fig');
    let histDiv = document.getElementById('fig2');
    let tableDiv = document.getElementById('resultInd');
    changeDisplay(graphDiv, 'block');
    changeDisplay(histDiv, 'none');
    changeDisplay(tableDiv, 'none');
}

function histButtonClick(){
    event.preventDefault();
    let graphDiv = document.getElementById('fig');
    let histDiv = document.getElementById('fig2');
    let tableDiv = document.getElementById('resultInd');
    changeDisplay(histDiv, 'block');
    changeDisplay(graphDiv, 'none');
    changeDisplay(tableDiv, 'none');
}

function tableButtonClick(){
    event.preventDefault();
    let graphDiv = document.getElementById('fig');
    let histDiv = document.getElementById('fig2');
    let tableDiv = document.getElementById('resultInd');
    changeDisplay(tableDiv, 'block');
    changeDisplay(graphDiv, 'none');
    changeDisplay(histDiv, 'none');
}

function startButtonClick(){
    event.preventDefault();
    Vlab.update(Vlab.editor)
}

function changeDisplay($node, value) {
    $node.style.display = value;
    return $node;
}

function isHidden($node) {
    return window.getComputedStyle($node).display === 'none';
}
