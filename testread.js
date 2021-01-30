const {open,readlines}=require('pengine');
const db=open('plitr0ccc');
const pageline=db.getpageline(0)[0];
const lines=readlines(db,pageline[2],10);

console.log(lines);