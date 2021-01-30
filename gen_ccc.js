const rootpath="../../tipitaka/ccc/agama/htdocs/agama/";
const {readFileSync,writeFileSync,readdirSync}=require('fs');
const paths=["MN"];

const dofile=(rawcontent,fn)=>{
	const start=rawcontent.indexOf('<span class="sutra_name">');
	const end=rawcontent.indexOf('<div id="east">');
	let content=rawcontent.substring(start+25,end);

	content=content.replace(/<a onMouseover="note\(this,(\d+)\);">(.+?)<\/a>/g,(m,id,w)=>{
			return '{'+id+'-'+w.length+'}'+w;
	})
	content=content.replace(/<a onMouseover="local\(this,(\d+)\);">(.+?)<\/a>/g,(m,id,w)=>{
			return '{l'+id+'-'+w.length+'}'+w;
	})

	content=content.replace(/<br>/g,'');
	content=content.replace(/<\/div>/g,'');
	content=content.replace(/<\/span>/g,'');
	content=content.replace(/<!(\d)>/g,(m,paraid)=>'{!'+paraid+'}');


	return content;
}

paths.forEach(p=>{
	const path=rootpath+p;
	const files=readdirSync(path).filter(s=>{return s.indexOf('.htm')>0&&s.indexOf(p)==0});
	//files.length=5;
	files.forEach(fn=>{
		const content=dofile(readFileSync(path+'/'+fn,'utf8'),fn);
		writeFileSync('cccraw/'+fn.replace('.htm','.txt'),content,'utf8')
	});

})
