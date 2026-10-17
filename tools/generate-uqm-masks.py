from pathlib import Path
import zipfile,re,io,json
from PIL import Image
import sys
# Input: official uqm-0.8.0-content.uqm; output is committed for reproducible offline builds.
z=zipfile.ZipFile(sys.argv[1]);rmp=z.read('uqm.rmp').decode();races=['urquan','blackurq','slylandro','chmmr','utwig','spathi','mycon','orz','chenjesu','supox','ilwrath','druuge','melnorme','mmrnmhrm','pkunk','androsynth','vux','human','syreen','zoqfotpik','umgah','thraddash','yehat','arilou','shofixti']
entries=[]
for line in rmp.splitlines():
 m=re.match(r'(\S+)\s*=\s*GFXRES:(\S+)',line)
 if m and (m[1].startswith('ship.') and '.graphics.' in m[1] or m[1] in ['graphics.blast.large','graphics.blast.medium','graphics.blast.small','graphics.stars','graphics.planets','graphics.boom.large','graphics.boom.medium','graphics.boom.small','graphics.asteroid.large','graphics.asteroid.medium','graphics.asteroid.small']) and m[2].endswith('.ani'):
  # Captain window graphics are frontend-only.
  if '.captain' not in m[1]:entries.append((m[1],m[2]))
out=['#include "bridge_gfx.h"','#include <string.h>'];groups=[];frames=[];images=[];data=bytearray();metadata=[]
for key,ani in entries:
 if ani not in z.namelist():continue
 lines=z.read(ani).decode().splitlines();parsed=[]
 for line in lines:
  parts=line.split()
  if len(parts)<5:continue
  try:hotx,hoty=map(int,parts[-2:])
  except:continue
  png=str(Path(ani).parent/parts[0]);im=Image.open(io.BytesIO(z.read(png))).convert('RGBA');w,h=im.size;offset=len(data);bits=bytearray((w*h+7)//8)
  for j,alpha in enumerate(im.getchannel('A').getdata()):
   if alpha:bits[j//8]|=1<<(j%8)
  data+=bits;parsed.append((w,h,hotx,hoty,offset))
 if not parsed:continue
 group=len(groups);base=len(frames);groups.append((key,base,len(parsed)));metadata.append({'key':key,'path':ani,'count':len(parsed)})
 for index,(w,h,x,y,offset) in enumerate(parsed):
  images.append(f'{{{w},{h},mask_data+{offset}}}');frames.append('{0,%d,{%d,%d},{%d,%d},&images[%d],&drawables[%d],%d}'%(index,x,y,w,h,len(images)-1,group,group))
out.append('static const unsigned char mask_data[]={' + ','.join(map(str,data))+'};')
out.append('static struct drawable_desc drawables['+str(len(groups))+'];')
out.append('static TFB_Image images[]={' + ','.join(images)+'};')
out.append('static struct frame_desc frames[]={' + ','.join(frames)+'};')
out.append('static struct {const char*key;int base,count;} resources[]={' + ','.join('{'+json.dumps(k)+f',{b},{n}'+'}' for k,b,n in groups)+'};')
out.append('FRAME orbit_resource(const char*k){if(!k)return NULL;for(int i=0;i<sizeof(resources)/sizeof(resources[0]);i++)if(!strcmp(k,resources[i].key)){drawables[i].Frame=frames+resources[i].base;drawables[i].MaxIndex=resources[i].count-1;return drawables[i].Frame;}return NULL;}')
out.append('COUNT GetFrameIndex(FRAME f){return f?f->Index:0;}\nCOUNT GetFrameCount(FRAME f){return f&&f->parent?f->parent->MaxIndex+1:1;}\nFRAME SetAbsFrameIndex(FRAME f,COUNT i){if(!f)return NULL;return f->parent->Frame+(i%GetFrameCount(f));}\nFRAME SetRelFrameIndex(FRAME f,SIZE i){int n=GetFrameCount(f),index=(GetFrameIndex(f)+i)%n;if(index<0)index+=n;return SetAbsFrameIndex(f,index);}\nFRAME IncFrameIndex(FRAME f){return SetRelFrameIndex(f,1);}\nFRAME DecFrameIndex(FRAME f){return SetRelFrameIndex(f,-1);}\nFRAME SetEquFrameIndex(FRAME f,FRAME g){return SetAbsFrameIndex(f,GetFrameIndex(g));}\nBOOLEAN GetFrameRect(FRAME f,RECT*r){if(!f)return FALSE;r->extent=f->Bounds;r->corner.x=-f->HotSpot.x;r->corner.y=-f->HotSpot.y;return TRUE;}')
out.append('BOOLEAN TFB_DrawImage_Intersect(TFB_Image*a,POINT ap,TFB_Image*b,POINT bp,const RECT*r){if(!a||!b)return FALSE;for(int y=r->corner.y;y<r->corner.y+r->extent.height;y++)for(int x=r->corner.x;x<r->corner.x+r->extent.width;x++){int ax=x-ap.x,ay=y-ap.y,bx=x-bp.x,by=y-bp.y;if(ax<0||ay<0||bx<0||by<0||ax>=a->w||ay>=a->h||bx>=b->w||by>=b->h)continue;int ai=ay*a->w+ax,bi=by*b->w+bx;if((a->bits[ai>>3]&(1<<(ai&7)))&&(b->bits[bi>>3]&(1<<(bi&7))))return TRUE;}return FALSE;}')
repo=Path(__file__).resolve().parents[1];(repo/'native/uqm/collision-assets.c').write_text('\n'.join(out));(repo/'native/uqm/collision-assets.json').write_text(json.dumps(metadata,indent=2));print(len(groups),'animations',len(frames),'frames',len(data),'mask bytes')
