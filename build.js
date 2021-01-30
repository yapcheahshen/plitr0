'use strict'
const {readFileSync,existsSync}=require("fs");
const {createbuilder}=require("pengine");
const translator=process.argv[2]||'ccc';
const dbname='plitr0'+translator, folder=translator+"edit/";
const booknames={
	mn1:[1,50],mn2:[51,100],mn3:[101,152]
}
const makecontent=(contents,rawlines,lastparanum,lastseq,fn)=>{
	let seq=lastseq;
	let paranum=lastparanum;
	for (var i=0;i<rawlines.length;i++) {
		//處理 次段號, 排序，補空行
		const linetext=rawlines[i].replace(/\{.+?\-.+?\}/g,''); //remove hyperlink
		const at2=linetext.indexOf("|");
		if (at2==-1) {
			console.log('auto paranum',fn, paranum+'-'+seq,linetext);
			seq++;
		} else {
			const m=linetext.match(/(\d+)\-(\d+)\|/);
			if (!m) {
				throw 'invalid paranum '+fn+' '+linetext;
			}
			paranum=parseInt(m[1]);
			seq=parseInt(m[2]);
			if (!seq) throw 'error seq '+fn+' '+linetext
		}
		if (!contents[paranum]) contents[paranum]=[];
		if (contents[paranum][seq-1]) {
			throw 'repeated paranum '+fn+' '+linetext;
		}
		contents[paranum][seq-1]=linetext.substr(at2+1);
	}
	return {paranum,seq}
}
const getbookcontent=(contents,bookname,bookrange)=>{

}
const build=()=>{
	let prevbk='',prevparanum,paranum=0,seq=0,pagegroup=0,prevpagegroup=0;
	const builder=createbuilder({name:dbname});
	
	for (var bk in booknames) {
		const contents=[];
		const bookrange=booknames[bk];
		//paranum=0,seq=0;
		for (let i=bookrange[0];i<=bookrange[1];i++) {
			let s='00'+i;
			const fn=bk.replace(/\d+/,'')+s.substr(s.length-3)+'.txt';
			if (!existsSync(folder+fn)) continue;
			const rawlines=readFileSync(folder+fn,'utf8').split(/\r?\n/);
			const res=makecontent(contents,rawlines,paranum,seq,fn);
			paranum=res.paranum, seq=res.seq;

		};
		for (let pn in contents) {
			builder.newpage(pn,0,bk);
			for (let l in contents[pn]) {
				builder.addline(contents[pn][l]);
			}
		}
		builder.addbook(bk);

	}
	

/*
			if (prevbk&&bk!==prevbk){
				builder.newpage(-1,pagegroup);
				builder.addbook(prevbk);
				pagegroup=0;
				prevpagegroup=0;
			}

			prevbk=bk;
			
			const at2=content.indexOf("|");
			if (at2>-1 && parseInt(content)) {
				const grouppara=content.substr(0,at2);
				let paranum=parseInt(grouppara);
				const at3=grouppara.indexOf("-");
				if (at3>-1) {
					pagegroup=parseInt(grouppara);
				} else {
					pagegroup=0;
				}
				
				paranum=parseInt(grouppara.substr(at3+1));
				console.log(pagegroup,paranum);
				if (prevpagegroup&&prevpagegroup!==pagegroup) {
					builder.newpage(-1, prevpagegroup,bk);
				}
				prevpagegroup=pagegroup;
			
				builder.newpage(paranum,pagegroup,bk);
				prevparanum=paranum;
			}
			builder.addline(content);
		}
*/
//	console.log(contents)
	//builder.addbook(prevbk);
	const payload=[];
	builder.done(payload,{});
}
build();