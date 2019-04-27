const hbs = require('hbs');

hbs.registerHelper('listarCursos', (listado) =>{

    listaCursos = listado
    let texto = "<table class='table table-striped'>"+
                "<thead>"+
                "<th> Nombre </th>"+
                "<th> Descripción </th>"+
                "<th> Valor </th>"+
                "<th> Modalidad </th>"+
                "<th> Intensidad </th>"+
                "<th> Estado </th>"+
                "<th> Cambiar Estado </th>"+
                "</thead>"+
                "</tbody>";

    listaCursos.forEach(curso => {

        boton = "";

        boton = boton + "<form action='/cambiarEstadoCurso' method='POST'>"+
                        "<input type='hidden' name='id' value='"+curso._id+"'>";

        if(curso.estado == 'disponible')
            boton = boton + "<button type='submit' class='btn btn-outline-danger' name='estado' value='cerrado'>Cerrar</button>";
        else
            boton = boton + "<button type='submit' class='btn btn-outline-success' name='estado' value='disponible'>Habilitar</button>";
        
        boton = boton + "</form>";

        texto = texto + "<tr>"+
                        "<td>"+curso.nombre +"</td>" +
                        "<td>"+curso.descripcion +"</td>" +
                        "<td>"+curso.valor +"</td>" +
                        "<td>"+curso.modalidad +"</td>" +
                        "<td>"+curso.intensidadHoraria +"</td>" +
                        "<td>"+curso.estado  +"</td>" +
                        "<td>"+boton +"</td>" +
                        "</tr>";
    });

    texto = texto + "<tbody>"+
                    "</table>";

    return texto;
});

hbs.registerHelper('detalleCursos', (listado) =>{
    listaCursos = listado
    let texto = "";

    listaCursos.forEach(curso => {

        if(curso.estado == "disponible")
        {
            texto = texto + "<div class='col-md-4'>"+
                                "<div id='accordion'>"+
                                    "<div class='card'>"+
                                        "<div class='card-header' id='headingTwo'>"+
                                            "<h5 class='mb-0'>"+
                                                "<button class='btn btn-link collapsed' data-toggle='collapse' data-target='#collapseTwo"+curso._id +"'"+
                                                    "aria-expanded='false' aria-controls='collapseTwo"+curso._id +"'>"+
                                                    "<strong>"+ curso.nombre +"</strong>"+
                                                "</button>"+
                                            "</h5>"+
                                        "</div>"+
                                        "<div id='collapseTwo"+curso._id +"' class='collapse' aria-labelledby='headingTwo' data-parent='#accordion'>"+
                                            "<div class='card-body'>"+
                                                "<ul>"+
                                                    "<li><strong>Id: </strong>"+curso._id +"</li>"+
                                                    "<li><strong>Nombre: </strong>"+curso.nombre +"</li>"+
                                                    "<li><strong>Modalidad: </strong>"+curso.modalidad +"</li>"+
                                                    "<li><strong>Valor: </strong>"+curso.valor +"</li>"+
                                                    "<li><strong>Descripción: </strong>"+curso.descripcion +"</li>"+
                                                    "<li><strong>Intensidad horaria: </strong>"+curso.intensidadhoraria +"</li>"+
                                                    "<li><strong>Estado: </strong>"+curso.estado +"</li>"+
                                                "</ul>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
        }
    });

    return texto;
});

hbs.registerHelper('selectHtmlCursosDisponibles', (listado) =>{
    listaCursos = listado

    let texto = "<select class='form-control' id='curso' name='curso'>"+
                    "<option value=''>Seleccione curso...</option>";

    listaCursos.forEach(curso => {

        if(curso.estado == "disponible")
        {
            texto = texto + "<option value='"+curso._id +"'>"+curso.nombre +"</option>";
        }
    });

    texto = texto + "</select>";

    return texto;
});

hbs.registerHelper('validarInscripcionAspirante', (resultadoInscripcionAspirante) =>{

    if(resultadoInscripcionAspirante == true)
    {
        return "<div class='alert alert-success' role='alert'>"+
                    "<p>El aspirante se ha registrado en el curso exitosamente.</p>"+
                "</div>";
    }
    else if(resultadoInscripcionAspirante == false)
    {
        return "<div class='alert alert-warning' role='alert'>"+
                    "<p>El aspirante ya se encuentra inscrito en este curso.</p>"+
                "</div>";
    }
    else
        return "";
});

hbs.registerHelper('validarSesionNoIniciada', (sesion) =>{

    return !sesion ? true : false;
});

hbs.registerHelper('verCursosInscrito', (listado) =>{
    listaCursos = listado
    let texto = "";

    if(listado.length == 0)
    {
        texto = "<div class='alert alert-warning' role='alert'>"+
                    "<p>El aspirante no esta registrado en nigun curso.</p>"+
                "</div>";
    }
    else
    {
        listaCursos.forEach(curso => {

            texto = texto + "<div class='col-md-4'>"+
                                "<div id='accordion'>"+
                                    "<div class='card'>"+
                                        "<div class='card-header' id='headingTwo'>"+
                                            "<h5 class='mb-0'>"+
                                                "<button class='btn btn-link collapsed' data-toggle='collapse' data-target='#collapseTwo"+curso._id +"'"+
                                                    "aria-expanded='false' aria-controls='collapseTwo"+curso._id +"'>"+
                                                    "<strong>"+ curso.nombre +"</strong>"+
                                                "</button>"+
                                            "</h5>"+
                                        "</div>"+
                                        "<div id='collapseTwo"+curso._id +"' class='collapse' aria-labelledby='headingTwo' data-parent='#accordion'>"+
                                            "<div class='card-body'>"+
                                                "<ul>"+
                                                    "<li><strong>Id: </strong>"+curso._id +"</li>"+
                                                    "<li><strong>Nombre: </strong>"+curso.nombre +"</li>"+
                                                    "<li><strong>Modalidad: </strong>"+curso.modalidad +"</li>"+
                                                    "<li><strong>Valor: </strong>"+curso.valor +"</li>"+
                                                    "<li><strong>Descripción: </strong>"+curso.descripcion +"</li>"+
                                                    "<li><strong>Intensidad horaria: </strong>"+curso.intensidadhoraria +"</li>"+
                                                    "<li><strong>Estado: </strong>"+curso.estado +"</li>"+
                                                "</ul>"+
                                                "<form action='/cancelarcurso' method='POST'>" +
                                                "<input type='hidden' name='idCurso' value='"+curso._id +"'>"+
                                                "<button class='btn btn-outline-danger'>Cancelar curso</button>"+
                                                "</form>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
        });
    }

    return texto;
});

hbs.registerHelper('listarAspirantesInscritos', (listaCursos) =>{
    listaCursos = listaCursos
    let texto = "";

    listaCursos.forEach(curso => {

        let textoAspirante = "";

        if(curso.aspirantes.length > 0)
        {
            textoAspirante = "<table class='table table-striped table-responsive'>"+
                                "<thead>"+
                                "<th> Eliminar </th>"+
                                "<th> Documento </th>"+
                                "<th> Nombre </th>"+
                                "<th> Correo </th>"+
                                "</thead>"+
                                "</tbody>";

            curso.aspirantes.forEach(aspirante => {
                textoAspirante = textoAspirante + "<tr>"+
                                                        "<td>"+
                                                            "<form action='/eliminarAspiranteCurso' method='POST'>"+
                                                                "<input type='hidden' name='idCurso' value='"+curso._id+"'>"+
                                                                "<input type='hidden' name='idAspirante' value='"+aspirante._id+"'>"+
                                                                "<button type='submit' class='btn btn-danger'>Eliminar</button>"+
                                                            "</form>"+
                                                        "</td>" +
                                                        "<td>"+aspirante.nroDocumento +"</td>" +
                                                        "<td>"+aspirante.nombre +"</td>" +
                                                        "<td>"+aspirante.correo +"</td>" +
                                                    "</tr>";
            });

            textoAspirante = textoAspirante + "<tbody>"+
                                            "</table>";
        }
        else
        {
            textoAspirante = textoAspirante + "<div class='alert alert-warning' role='alert'>" +
                                                    "<p>No hay aspirantes inscritos a este curso</p>" +
                                                "</div>";   
        }

        texto = texto + "<div class='col-md-6'>"+
                            "<div id='accordion'>"+
                                "<div class='card'>"+
                                    "<div class='card-header' id='headingTwo'>"+
                                        "<h5 class='mb-0'>"+
                                            "<button class='btn btn-link collapsed' data-toggle='collapse' data-target='#collapseTwo"+curso._id +"'"+
                                                "aria-expanded='false' aria-controls='collapseTwo"+curso._id +"'>"+
                                                "<strong>"+ curso.nombre +"</strong>"+
                                            "</button>"+
                                        "</h5>"+
                                    "</div>"+
                                    "<div id='collapseTwo"+curso._id +"' class='collapse' aria-labelledby='headingTwo' data-parent='#accordion'>"+
                                        "<div class='card-body'>"+
                                            textoAspirante +
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
        
    });

    return texto;
});