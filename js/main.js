(function() {
  get_orders();
})();

// ----------------------------------- MODAL
// Boton nuevo
$('#btn_nuevo_campo').on('click', function(){
  $('#myModal').css('display', 'block');
  limpiarCampos();
});

// Cerrarr modal
$('#btn_close').on('click', function(){
  $('#myModal').css('display', 'none');
});

$('#btn_close_msg').on('click', function(){
  $('#myModalMsg').css('display', 'none');
});

// Cerrar modal si presiono fuera del modal
$(window).on('click', function(event){
  var modal = document.getElementById("myModal");
  var modalmsg = document.getElementById("myModalMsg");
  if (event.target == modal || event.target == modalmsg) {
    modal.style.display = "none";
    modalmsg.style.display = "none";
  }
});

// -----------------------------------
let data_orders = {};

// Boton para buscar por el número de orden
$("#btn_search_numero_orden").on('click', function(){
  let numero_orden = $("#select_numero_orden").val();
  let encontrados = [];
  let buscados = data_orders['orders'].find(fruta => fruta.number == numero_orden);

  if(buscados != undefined) {
    encontrados.push(buscados);
  }

  if(encontrados.length === 0) {
    $('#table_tbody tr').remove();
    $('#btn_pagar').css('display', 'none');
    $('#btn_nuevo_campo').css('display', 'none');
  } else {
    llenarTabla(encontrados);
    $('#btn_pagar').css('display', 'block');
    $('#btn_nuevo_campo').css('display', 'block');
  }

  $('#inp_norden').val(numero_orden);
});

// Obtener las ordenes
function get_orders(){
  $.ajax({
    url: '', // URL
    type: 'GET',
    dataType : 'json',
    headers: {
      'Authorization': 'Bearer ' // Token
    },
    success: function(json){
      data_orders = json;

      let etiqueta = '<option selected>Número de orden</option>';
      for(i=0; i < data_orders['orders'].length; i++){
        etiqueta += '<option value="'+data_orders['orders'][i]['number']+'">'+data_orders['orders'][i]['number']+'</option>';
      }
      $('#select_numero_orden').append(etiqueta);
    },
    error: function(jqXHR, status, error) {
      alert("Hubo un error");
    },
    complete: function(jqXHR, status) {
      console.log('Petición realizada');
    }
  });
}

// llenamos la tabla pasandole un array con json
function llenarTabla(elementos) {
  $('#table_tbody tr').remove();

  let html = "";
  for (i=0; i< elementos.length; i++){
    for(j=0; j < elementos[i]['items'].length; j++){
      html += '<tr id="'+elementos[i]['items'][j]['id']+'">';
      html += '<td>'+elementos[i]['items'][j]['sku']+'</td>';
      html += '<td>'+elementos[i]['items'][j]['name']+'</td>';
      html += '<td>'+elementos[i]['items'][j]['quantity']+'</td>';
      html += '<td>'+elementos[i]['items'][j]['price']+'</td>';
      html += '</tr>';
    }
  }

  $('#table_tbody').append(html);
}

// Boton para mandar a guardar
$('#btn_guardar').on("click", function(){

  let elemento_nuevo = {};

  $("#myModal .formulario input").each(function(){
    if($(this).val() == ""){
      $(this).addClass('error');
    } else {
      $(this).removeClass('error');
      elemento_nuevo[$(this).attr('name')] = $(this).val();
    }
  });

  if($("#myModal .formulario .error").length == 0){
    let encontrados = [];
    let buscados = data_orders['orders'].find(fruta => fruta.number == $("#inp_norden").val());
    if(buscados != undefined) {
      buscados['items'].push(elemento_nuevo);
      encontrados.push(buscados);
      llenarTabla(encontrados);
      $('#myModal').css('display', 'none');
    }
    $('#myModal .msgError').css("display", 'none');
  } else {
    $('#myModal .msgError').css("display", 'block');
  }
});

// Limpiar los campos cuando se cierre el modal
function limpiarCampos(){
  $("#myModal .formulario input").each(function(){
    if($(this).attr('name') != 'numero_orden'){
      $(this).val(""); 
    }
    $(this).removeClass('error');
  });
  $('#myModal .msgError').css("display", 'none');
}

// Boton para pagar
$('#btn_pagar').on('click', function(){
  $('#myModalMsg').css('display', 'block');
});

$('.decimales').on('input', function () {
  this.value = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
});