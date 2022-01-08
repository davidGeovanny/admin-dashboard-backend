const XLSX = require('sheetjs-style');

const createExcelFile = ( data = [], fileName = 'excel' ) => {
  try {
    const currentTime = new Date().getTime();
  
    if( fileName.includes('.xlsx') ) {
      fileName = fileName.replace('.xlsx', `-${ currentTime }.xlsx`);
    } else {
      fileName = `${ fileName }-${ currentTime }.xlsx`;
    }
  
    const ws = XLSX.utils.json_to_sheet( data );
    autofitColumn( data, ws );
    setStyleToSheet( ws );
  
    /* Generate workbook and add the worksheet */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( wb, ws, 'Sheet1' );
  
    /* Save to file */
    XLSX.writeFile( wb, `tmp/${ fileName }` );
  
    return fileName;
  } catch ( err ) {
    return '';
  }
}

const setStyleToSheet = ( worksheet ) => {
  if( !worksheet['!ref'] ) return;

  const range = XLSX.utils.decode_range( worksheet['!ref'] );

  for( let row = range.s.r; row <= range.e.r; ++row ) {
    for( let column = range.s.c; column <= range.e.c; ++column ) {
      const cell_address = { c: column, r: row };
      /* if a cell address is needed, encode the address */
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

      worksheet[ cell_ref ].s = style;
    }
  }
}

const autofitColumn = ( json, worksheet ) => {
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

module.exports = {
  createExcelFile,
};