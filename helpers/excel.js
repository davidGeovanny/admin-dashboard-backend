const { response, request } = require('express');

const XLSX = require('sheetjs-style');

const setStyleToSheet = ( worksheet ) => {
  if( !worksheet['!ref'] ) return;

  const range = XLSX.utils.decode_range( worksheet['!ref'] );

  for( let row = range.s.r; row <= range.e.r; ++row ) {
    for( let cell = range.s.c; cell <= range.e.c; ++cell ) {
      const cell_address = { c: cell, r: row };
      const cell_ref = XLSX.utils.encode_cell( cell_address );

      let style;

      if( row === 0 ) {
        // Header style
        style = {
          font: {
            name:  'Arial',
            sz:    13,
            bold:  true,
            color: { rgb: 'ffffff' }
          },
          fill: {
            fgColor: { rgb: '446AD8' }
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          }
        };
        // body style
      } else {
        style = {
          font: {
            name:  'Arial',
            sz:    12,
            bold:  false,
            color: { rgb: '000000' }
          },
          fill: {
            fgColor: { rgb: 'ffffff' }
          }
        };
      }

      /* if an A1-style address is needed, encode the address */
      worksheet[ cell_ref ].s = style;
    }
  }
}

const autofitColumn = ( json, worksheet ) => {//Adaptación de celda al tamaño del contenido
  let objectMaxLength = [];

  json.forEach( ( jsonData ) => {
    Object.entries( jsonData ).forEach( ( [ k , v ], idx ) => {
      let columnValue = '';

      if( typeof v === 'number' ) {
        columnValue = v.toString();
      } else {
        columnValue = v;
      }

      if( k.length > columnValue.length ) {
        columnValue = k;
      }

      objectMaxLength[ idx ] = ( objectMaxLength[ idx ] >= columnValue.length )
        ? objectMaxLength[ idx ]
        : ( columnValue.length + 5 );
    });
  });

  const wscols = objectMaxLength.map( ( w ) => ( { width: w } ));
  worksheet['!cols'] = wscols;
};

const ConvertirJSONaExcel = (rows) =>{
    let nombre = "Archivo";
  
    nombre = nombre + new Date().getTime();//Asignación de nombre a Archivo (sin sobreescribir)

    const workSheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_json(workSheet, rows)
    const workBook = XLSX.utils.book_new();

    setStyleToSheet( workSheet );
    autofitColumn(rows, workSheet );

    XLSX.utils.book_append_sheet(workBook,workSheet,"Hoja 1")//Asignación del nombre de la Hoja

    XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})//Crear Buffer

    XLSX.write(workBook,{bookType:"xlsx",type:"binary"})//Cadena Binaria 

    XLSX.writeFile(workBook, "Files/" + nombre + ".xlsx")//Asignación del nombre del Libro en la ruta correspondiente

    return nombre + ".xlsx";
}

module.exports = {
  ConvertirJSONaExcel,
};