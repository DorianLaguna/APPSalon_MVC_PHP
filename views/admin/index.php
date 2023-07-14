<h1 class="nombre-pagina">Panel de administracion</h1>

<?php include_once __DIR__ . '/../templates/barra.php'; ?>


<h2>Buscar citas</h2>

<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>">
        </div>
    </form>
</div>

<?php if(count($citas) === 0){
    echo "No hay citas en esta fecha";
} ?>

<div id="citas-admin">
    <ul class="citas">
        <?php
            $idCita = '';
            foreach ($citas as $key => $cita) {
                if($idCita !== $cita->id){
                    $total = 0;
                    $idCita = $cita->id;
        ?>
        
        <li>
            <p>ID: <span><?php echo $cita->id ?></span></p>
            <p>Hora: <span><?php echo $cita->hora ?></span></p>
            <p>Cliente: <span><?php echo $cita->cliente ?></span></p>
            <p>Email: <span><?php echo $cita->email ?></span></p>
            <p>Telefono: <span><?php echo $cita->telefono ?></span></p>

            <H3>Servicios</H3>
            <?php }  //termina if?>
            <p class="servicio"><?php echo $cita->servicio . ' ' . $cita->precio; ?></p>
        </li>

            <?php 
            $total += $cita->precio;
            $actual = $cita->id;
            $proximo = $citas[$key + 1]->id ?? 0;
            
            if(esUltimo($actual, $proximo)){ ?>
                <p class="total">Total: <span><?php echo $total ?></span></p>
                <form action="/api/eliminar" method="POST">
                    <input type="hidden" name="id" value="<?php echo $cita->id;?>">
                    <input type="submit" class="boton-eliminar" value="eliminar">
                </form>
        <?php 
    
            }
        } //termina foreach ?>
    </ul>
</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>"

?>