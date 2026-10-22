import sharp from 'sharp';
const { data, info } = await sharp('images/logo.png').raw().toBuffer({ resolveWithObject: true });
const c = {}; 
for (let i = 0; i < data.length; i += info.channels) {
  if (data[i+3] < 250) continue;
  const k = [data[i]>>3, data[i+1]>>3, data[i+2]>>3].join(',');
  c[k] = (c[k]||0)+1;
}
const top = Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0].split(',').map(n=>n*8+4);
console.log('#'+top.map(n=>n.toString(16).padStart(2,'0')).join(''));
