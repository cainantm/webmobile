const URL_BASE = "http://localhost:3000/consumo-agua";

window.onload = function () {
    
}

function callAPI(url, method, callback, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url, true);
    if (method == 'POST' || method == 'PATCH' || method == 'PUT') {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }
    xhr.onload = function () {
        callback(xhr.status, xhr.response);
    }
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

// function readAll() {
//     const url = URL_BASE;
//     callAPI(url, 'GET', function (status, response) {
//         if (status === 200) {
//             var content = document.getElementById("content");
//             content.innerHTML = "";
//             for (var i = 0; i < response.length; i++) {
//                 var str = createCard(response[i]);
//                 content.innerHTML += str;
//             }

//         } else {
//             alert("Erro ao contatar o servidor. Tente novamente mais tarde!");
//         }
//     });
// }

function inserirRegistroConsumo() {
    event.preventDefault();
    var consumo = {
        userId: document.getElementById('user-id').value,
        consumoAgua: document.getElementById('quantidade').value,
        dataLeitura: document.getElementById('data-consumo').value
    }

    const url = URL_BASE;

    callAPI(url, "POST", function (status, response) {
        if (status === 200 || status === 201) {
            alert("Registro inserido com sucesso");
            clear();
        } else {
            alert("ERRO: " + status);
        }
    }, consumo);
    clear();
}

function procuraHistorico(){
    event.preventDefault();
    const url = URL_BASE + "/historico";

    var historico = {
        userId: document.getElementById('historico-user-id').value,
        dataInicio: document.getElementById('data-inicial').value,
        dataFim: document.getElementById('data-final').value
    }

    callAPI(url, "POST", function(status, response){
        if(status === 200 || status === 201){
            response.sort((a, b) => new Date(a.dataLeitura) - new Date(b.dataLeitura));

            var content = document.getElementById("content");
            content.innerHTML = "";
            for (var i = 0; i < response.length; i++) {
                var str = createCard(response[i]);
                content.innerHTML += str;
            }
        } else if(status === 404){
            alert("Nenhum registro encontrado para o período informado.");
        } else {
            alert("Erro ao buscar histórico:" + status);
        }
    }, historico);
}

function clear() {
    document.getElementById('user-id').value = "";
    document.getElementById('quantidade').value = "";
    document.getElementById('data-consumo').value = "";
}

function createCard(consumo) {

    const dataFormatada = new Date(consumo.dataLeitura).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    var str = "<article>";
    str += "<h1> Usuário: " + consumo.userId + "</h1>";
    str += "<p>Consumo: " + consumo.consumoAgua + " m³</p>";
    str += "<p>Registrado em: " + dataFormatada + "</p>";
    str += "</article>";
    return str;
}
