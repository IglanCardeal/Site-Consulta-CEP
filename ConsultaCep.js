(function(window, document){
  'use strict';

  var $cep = document.querySelector('[data-js="cep"]');
  var $buttonPesq = document.querySelector('[data-js="button"]');
  var $status = document.querySelector('[data-js="status"]');
  var regex = /\d/gmi;

  /* Valores padrões do campo quando a página carregara */
  $cep.value = "";
  document.querySelector('[data-js="estado"]').value = "";
  document.querySelector('[data-js="cidade"]').value = "";
  document.querySelector('[data-js="logradouro"]').value = "";
  document.querySelector('[data-js="bairro"]').value = "";
  $status.value = "Aguardando requisição";

  /* Listener do botão de pesquisa */
  $buttonPesq.addEventListener('click', sendRequest, false);

  /* Função do listener de eventos de $buttonPesq */
  function sendRequest(event){
    event.preventDefault();
    if(onlyCepNumbers() == true){
      $status.value = 'Buscando informações para o CEP ' + $cep.value;
      addScriptForJson();
    }
  }

  /* Função que verifica se os formato dos valores passados para cep são válidos */
  function onlyCepNumbers(){
    if($cep.value == "")
      return alert('Digite algum CEP!');
    var onlyNumbers = $cep.value.match(regex);
    if(onlyNumbers == null || onlyNumbers.join('').length != 8){
      clearFields();
      return alert('CEP informado inválido');
    }
    return true;
  }

  /* Função que limpa os campos de texto */
  function clearFields(){
    $cep.value = "";
    document.querySelector('[data-js="estado"]').value = "";
    document.querySelector('[data-js="cidade"]').value = "";
    document.querySelector('[data-js="logradouro"]').value = "";
    document.querySelector('[data-js="bairro"]').value = "";
  }

  /* Função que acessa as propriedades do objeto json e atribui seus valores nos respectivos campos */
  function accessJson(content){
    var cepValue = document.querySelector('[data-js="cep"]').value;
    var $status = document.querySelector('[data-js="status"]');
    var $estado = document.querySelector('[data-js="estado"]');
    var $cidade = document.querySelector('[data-js="cidade"]');
    var $logradouro = document.querySelector('[data-js="logradouro"]');
    var $bairro = document.querySelector('[data-js="bairro"]');

    /* caso o cep não seja encontrado, retorna um json {"erro": true} */
    if(content.erro == true){
      $status.value = 'Não encontramos o endereço para o CEP ' + cepValue;
    }
    else{
      $status.value = 'Endereço referente ao CEP ' + cepValue + ' :';
      $estado.value = content.uf;
      $cidade.value = content.localidade;
      $logradouro.value = content.logradouro;
      $bairro.value = content.bairro;
    }
  }

  /* Função que adiciona scripts no body */
  function addScriptForJson(){

    /* Este comando cria um script que vai receber a função accessJson e adiciona-o no body */
    var scriptForJson = document.createElement('script');
    var my_accessJsonFunction = document.createTextNode(accessJson);
    scriptForJson.appendChild(my_accessJsonFunction);
    document.body.appendChild(scriptForJson);

    /* Este comando cria o script que vai realizar o request ao site viacep */
    var script = document.createElement('script');
    var url = "https://viacep.com.br/ws/[CEP]/json/?callback=accessJson";
    var cepInformado = $cep.value.match(regex).join(''); // match para pegar somente numeros
    script.src = url.replace('[CEP]', cepInformado);
    document.body.appendChild(script);
  }

})(window, document);
