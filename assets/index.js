$(document).ready(function() {

  function scrollToElement(elementID) {
    $('html, body').animate({
        scrollTop: $('#' + elementID).offset().top
    }, 2000);
  }

  function getAccountInfo() {
    $.post('/getAccounts', function(data) {
      if (data.success) {
        $('#NomeDeUsuario').text(data.user.NomeDeUsuario);
        $('#EmailDoUsuario').text(data.user.EmailDoUsuario);
        $('#Plano').text(data.user.Plano);
      } else {

        console.error('Erro ao buscar informações do usuário:', data.message);
      }
    });
  }
  getAccountInfo();
  
  var currentStep = 1;

   $(document).on('wheel', function(event) {
    event.preventDefault();

      if (event.originalEvent.deltaY > 0) {
        // Rolar para baixo
        if (currentStep === 1) {
          scrollToElement('nextImage');
          currentStep = 2;
        }else if(currentStep === 2){
          scrollToElement('nextImage2');
          currentStep = 3;
        }
      } else {
        // Rolar para cima
        if (currentStep === 2) {
          scrollToElement('login-form');
          currentStep = 1;
        }else if(currentStep === 3){
          scrollToElement('nextImage');
          currentStep = 2;
        }
      }
    });
    
  $("#btnProximo").click(function() {
    var nome = $("#inputNome").val();
    if (nome) {
      $.ajax({
        url: 'http://localhost:8080/get-license',
        type: 'POST',
        data: { nome: nome }, 
        success: function(response) {
          console.log(JSON.stringify(response));
          if (response.success) {
            $("#formulario").hide();
            $("#sobrenomeDiv").show();
          } else {
            console.error('Erro no sucesso da solicitação:', response);
            alert("Você não está logado ou seu plano não é compatível.");
          }
        },
        error: function(err) {
          console.error('Erro na solicitação:', err);
          console.log(JSON.stringify(err));
          alert("Ocorreu um erro na solicitação.");
        }
      });
    } else {
      alert("Por favor, digite seu nome.");
    }
  });

  $("#btnCriar").click(function() {
    var sobrenome = $("#inputSobrenome").val();
    if (sobrenome) {
      var nome = $("#inputNome").val();
      var nomeCompleto = nome + " " + sobrenome;

      $.post({
        url: 'http://localhost:8080/enviar-nome',
        data: { nomeCompleto: nomeCompleto },
        success: function(data) {
          console.log(data);
        },
        error: function(err) {
          console.error(err);
        }
      });

      $("#sobrenomeDiv").hide();
      $("#resultado").show();
      $("#nomeCompletoQuadrado").text(nomeCompleto);
    } else {
      alert("Por favor, digite seu sobrenome.");
    }
  });

  $("#btnBaixar").click(function() {
    html2canvas(document.getElementById("quadrado")).then(function(canvas) {
      var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      var link = document.createElement("a");
      link.href = image;
      link.download = "quadrado.png";
      link.click();
    });
  });


});
