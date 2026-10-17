#include "bridge_gfx.h"
#include "uqm/tactrans.h"
#include "uqm/ship.h"
#include "uqm/collide.h"
#include "uqm/intel.h"
#include "uqm/globdata.h"
#include "uqm/status.h"
#include "uqm/setup.h"
#include "uqm/weapon.h"
#include "libs/mathlib.h"
#include <stdlib.h>
#include <string.h>
#include <math.h>
GLOBDATA GlobData;
// A larger battle field keeps combat away from the original arena seams.
int ScreenWidth=1086,ScreenHeight=1022;
CONTEXT StatusContext;
BOOLEAN optStereoSFX=FALSE;
FRAME stars_in_space,blast[3],planet[3],explosion[3],asteroid[3];
BYTE battle_counter[2]={1,1};
SOUND GameSounds;
extern void orbit_queue_tick(void);extern int orbit_scroll_x,orbit_scroll_y;extern void InitDisplayList(void);
extern void orbit_sound_clear(void),orbit_hit_clear(void);
static int player_delta;
static STARSHIP ships[32];
static int pilot_override[32];
static RACE_DESC descriptors[32];
extern void orbit_pre(ELEMENT*),orbit_post(ELEMENT*),SetUpElement(ELEMENT*);
#define RACES(X) X(urquan) X(black_urquan) X(slylandro) X(chmmr) X(utwig) X(spathi) X(mycon) X(orz) X(chenjesu) X(supox) X(ilwrath) X(druuge) X(melnorme) X(mmrnmhrm) X(pkunk) X(androsynth) X(vux) X(human) X(syreen) X(zoqfotpik) X(umgah) X(thraddash) X(yehat) X(arilou) X(shofixti)
#define DECL(n) extern RACE_DESC *init_##n(void);
RACES(DECL)
#define INIT(n) init_##n,
static RACE_DESC*(*inits[])(void)={RACES(INIT)};
void *HMalloc(size_t n){return calloc(1,n);}void HFree(void*p){free(p);}void *HCalloc(size_t n){return calloc(1,n);}void *HRealloc(void*p,size_t n){return realloc(p,n);}
void DeltaStatistics(SHIP_INFO *p,COORD y,SIZE crew,SIZE energy){if(p==&descriptors[0].ship_info)player_delta+=crew;p->crew_level+=crew;p->energy_level+=energy;}
void PreProcessStatus(ELEMENT*e){}void PostProcessStatus(ELEMENT*e){((STARSHIP*)e->pParent)->old_status_flags=((STARSHIP*)e->pParent)->cur_status_flags;}
__attribute__((export_name("orbit_reset"))) void orbit_reset(void){player_delta=0;orbit_sound_clear();orbit_hit_clear();memset(ships,0,sizeof ships);for(int i=0;i<32;i++)pilot_override[i]=-1;memset(descriptors,0,sizeof descriptors);memset(&GlobData,0,sizeof GlobData);GLOBAL(CurrentActivity)=IN_ENCOUNTER;if(disp_q.pq_tab)UninitQueue(&disp_q);InitQueue(&disp_q,150,sizeof(ELEMENT));for(int i=0;i<MAX_DISPLAY_PRIMS;i++){SetPrimLinks(&DisplayArray[i],END_OF_LIST,i+1);}SetPrimLinks(&DisplayArray[MAX_DISPLAY_PRIMS-1],END_OF_LIST,END_OF_LIST);DisplayFreeList=0;InitDisplayList();orbit_scroll_x=orbit_scroll_y=0;battle_counter[0]=battle_counter[1]=1;stars_in_space=orbit_resource("graphics.stars");const char*views[]={"graphics.blast.large","graphics.blast.medium","graphics.blast.small"};for(int i=0;i<3;i++){blast[i]=orbit_resource(views[i]);planet[i]=orbit_resource("graphics.planets");asteroid[i]=orbit_resource(i==0?"graphics.asteroid.large":i==1?"graphics.asteroid.medium":"graphics.asteroid.small");explosion[i]=orbit_resource(i==0?"graphics.boom.large":i==1?"graphics.boom.medium":"graphics.boom.small");}}

__attribute__((export_name("orbit_add"))) int orbit_add(int slot,int race,int side,int x,int y,int face,int crew){STARSHIP*s=&ships[slot];s->RaceDescPtr=&descriptors[slot];*s->RaceDescPtr=*inits[race]();s->playerNr=side;s->control=CYBORG_CONTROL|AWESOME_RATING;s->ShipFacing=face;s->crew_level=crew;s->max_crew=crew;RACE_DESC*r=s->RaceDescPtr;if(crew<=0)crew=r->ship_info.crew_level;s->crew_level=s->max_crew=crew;r->ship_info.crew_level=crew;if(slot==0)r->ship_info.max_crew=crew;s->max_crew=r->ship_info.max_crew;for(int i=0;i<3;i++){r->ship_data.ship[i]=orbit_resource(r->ship_data.ship_rsc[i]);r->ship_data.weapon[i]=orbit_resource(r->ship_data.weapon_rsc[i]);r->ship_data.special[i]=orbit_resource(r->ship_data.special_rsc[i]);}ELEMENT*e=(ELEMENT*)AllocElement();if(!e)return 0;s->hShip=e;e->playerNr=side;e->pParent=s;e->state_flags=APPEARING|PLAYER_SHIP|IGNORE_SIMILAR;e->life_span=NORMAL_LIFE;e->crew_level=crew;e->mass_points=r->characteristics.ship_mass;e->current.location=(POINT){x,y};e->next=e->current;e->current.image.farray=e->next.image.farray=r->ship_data.ship;e->current.image.frame=e->next.image.frame=SetAbsFrameIndex(r->ship_data.ship[0],face);e->preprocess_func=ship_preprocess;e->postprocess_func=ship_postprocess;e->collision_func=collision;e->death_func=ship_death;SetPrimType(&DisplayArray[e->PrimIndex],STAMP_PRIM);SetUpElement(e);PutElement(e);return (int)e;}
__attribute__((export_name("orbit_override_input"))) void orbit_override_input(int slot,int flags){if(slot>0&&slot<32)pilot_override[slot]=flags;}
__attribute__((export_name("orbit_world_size"))) int orbit_world_size(int axis){return axis?LOG_SPACE_HEIGHT:LOG_SPACE_WIDTH;}
__attribute__((export_name("orbit_tick"))) void orbit_tick(void){for(int i=1;i<32;i++){ELEMENT*e=ships[i].hShip;if(e&&e->pParent==&ships[i]&&(e->state_flags&PLAYER_SHIP)&&e->crew_level){tactical_intelligence(NULL,&ships[i]);if(pilot_override[i]>=0)ships[i].ship_input_state=(ships[i].ship_input_state&~(LEFT|RIGHT|THRUST))|(pilot_override[i]&(LEFT|RIGHT|THRUST));}pilot_override[i]=-1;}orbit_queue_tick();}
__attribute__((export_name("orbit_count"))) int orbit_count(void){return CountLinks(&disp_q);}
__attribute__((export_name("orbit_ship"))) int orbit_ship(int slot){return (int)ships[slot].hShip;}

FRAME _CurFramePtr;
CONTEXT SetContext(CONTEXT c){return c;}
void DrawStamp(STAMP*s){}
BOOLEAN DestroyDrawable(DRAWABLE d){return TRUE;}
DRAWABLE ReleaseDrawable(FRAME f){return f?f->parent:0;}
void InitShipStatus(SHIP_INFO*p,STARSHIP*s,RECT*r){}
void DrawCaptainsWindow(STARSHIP*s){}
STRING SetAbsStringTableIndex(STRING s,COUNT i){return (STRING)(uintptr_t)(i+1);}
COUNT GetStringTableCount(STRING s){return 8;}
void ProcessSound(SOUND s,ELEMENT*e){extern void orbit_record_sound(SOUND,ELEMENT*);orbit_record_sound(s,e);}
void RemoveSoundsForObject(ELEMENT*e){}
void log_add(int level,const char*msg,...){}
int main(void){return 0;}
static int out_rows[150][32];static int out_count;
__attribute__((export_name("orbit_snapshot"))) int orbit_snapshot(void){out_count=0;for(HELEMENT h=GetHeadElement();h&&out_count<150;h=GetSuccElement((ELEMENT*)h)){ELEMENT*e=h;STARSHIP*s=e->pParent;int slot=(s>=ships&&s<ships+32)?(int)(s-ships):-1;int *r=out_rows[out_count++];memset(r,0,32*sizeof(int));SIZE vx,vy;GetCurrentVelocityComponents(&e->velocity,&vx,&vy);r[0]=(int)e;r[1]=slot;r[2]=e->state_flags;r[3]=e->life_span;r[4]=e->hit_points;r[5]=e->mass_points;r[6]=e->current.location.x-orbit_scroll_x;r[7]=e->current.location.y-orbit_scroll_y;r[8]=e->next.location.x-orbit_scroll_x;r[9]=e->next.location.y-orbit_scroll_y;r[10]=vx;r[11]=vy;r[12]=GetFrameIndex(e->current.image.frame);r[13]=e->current.image.frame?e->current.image.frame->group:-1;r[14]=GetPrimType(&DisplayArray[e->PrimIndex]);Color color=GetPrimColor(&DisplayArray[e->PrimIndex]);r[15]=(color.r<<16)|(color.g<<8)|color.b;if(slot>=0){r[16]=s->ShipFacing;r[17]=s->cur_status_flags;r[18]=s->RaceDescPtr->ship_info.energy_level;FRAME*f=e->current.image.farray;r[19]=f==s->RaceDescPtr->ship_data.ship?0:f==s->RaceDescPtr->ship_data.weapon?1:f==s->RaceDescPtr->ship_data.special?2:3;r[21]=s->weapon_counter;r[22]=s->special_counter;}r[20]=GetFrameCount(e->current.image.frame);if(e->current.image.frame){r[23]=e->current.image.frame->Bounds.width;r[24]=e->current.image.frame->Bounds.height;}r[25]=e->playerNr;r[26]=(int)e->preprocess_func;r[27]=(int)e->postprocess_func;r[28]=(int)e->death_func;r[29]=e->current.image.farray==&stars_in_space&&r[14]==POINT_PRIM;}return (int)out_rows;}
__attribute__((export_name("orbit_snapshot_count"))) int orbit_snapshot_count(void){return out_count;}
__attribute__((export_name("orbit_set_player"))) void orbit_set_player(int x,int y,int vx,int vy,int face,int crew){STARSHIP*s=&ships[0];ELEMENT*e=s->hShip;if(!e)return;e->current.location=e->next.location=(POINT){WRAP_X(x+orbit_scroll_x),WRAP_Y(y+orbit_scroll_y)};SetVelocityComponents(&e->velocity,vx,vy);s->ShipFacing=face;e->crew_level=s->RaceDescPtr->ship_info.crew_level=crew;e->life_span=NORMAL_LIFE;e->state_flags=PLAYER_SHIP|IGNORE_SIMILAR|IGNORE_VELOCITY;e->preprocess_func=NULL;e->postprocess_func=NULL;e->death_func=NULL;e->current.image.frame=e->next.image.frame=SetAbsFrameIndex(e->current.image.farray[0],face);SetUpElement(e);}
__attribute__((export_name("orbit_damage"))) void orbit_damage(int id,int damage){ELEMENT*e=(ELEMENT*)id;if((unsigned char*)e>=disp_q.pq_tab&&(unsigned char*)e<disp_q.pq_tab+disp_q.object_size*disp_q.num_objects){if(e->state_flags&PLAYER_SHIP){ELEMENT*shot=AllocElement();if(!shot)return;shot->pParent=&ships[0];shot->playerNr=0;shot->state_flags=FINITE_LIFE|IGNORE_SIMILAR;shot->mass_points=damage>255?255:damage;shot->hit_points=1;shot->life_span=1;shot->current=e->current;shot->next=e->next;SetPrimType(&DisplayArray[shot->PrimIndex],LINE_PRIM);POINT point={WORLD_TO_DISPLAY(e->current.location.x),WORLD_TO_DISPLAY(e->current.location.y)};e->collision_func(e,&point,shot,&point);weapon_collision(shot,&point,e,&point);FreeElement(shot);}else do_damage(e,damage);}}
__attribute__((export_name("orbit_seed"))) void orbit_seed(int seed){TFB_SeedRandom(seed);}
__attribute__((export_name("orbit_stats"))) int orbit_stats(int race){RACE_DESC*r=inits[race]();static int values[20];values[0]=r->ship_info.crew_level;values[1]=r->ship_info.max_crew;values[2]=r->ship_info.energy_level;values[3]=r->ship_info.max_energy;values[4]=r->characteristics.max_thrust;values[5]=r->characteristics.thrust_increment;values[6]=r->characteristics.turn_wait;values[7]=r->characteristics.thrust_wait;values[8]=r->characteristics.weapon_energy_cost;values[9]=r->characteristics.weapon_wait;values[10]=r->characteristics.special_energy_cost;values[11]=r->characteristics.special_wait;values[12]=(SBYTE)r->characteristics.energy_regeneration;values[13]=r->characteristics.energy_wait;values[14]=r->characteristics.ship_mass;values[15]=r->ship_info.ship_flags;return (int)values;}
__attribute__((export_name("orbit_input"))) void orbit_input(int slot,int flags){ships[slot].ship_input_state=flags;}

HOT_SPOT GetFrameHot(FRAME f){return f->HotSpot;}
void TFB_DrawScreen_SetMipmap(void*a,void*b,int x,int y){}
static int sound_events[256][3],sound_size;
__attribute__((export_name("orbit_sound_ptr"))) int orbit_sound_ptr(void){return(int)sound_events;}
__attribute__((export_name("orbit_sound_count"))) int orbit_sound_count(void){return sound_size;}
__attribute__((export_name("orbit_sound_clear"))) void orbit_sound_clear(void){sound_size=0;}
__attribute__((export_name("orbit_entity_info"))) int orbit_entity_info(int id,int field){ELEMENT*e=(ELEMENT*)id;if(!e)return 0;if(field==0)return e->hit_points;if(field==1)return e->state_flags;if(field==2)return e->life_span;return 0;}
__attribute__((export_name("orbit_remove"))) void orbit_remove(int id){ELEMENT*e=(ELEMENT*)id;if(e){e->life_span=0;e->hit_points=0;e->state_flags|=NONSOLID;}}
static int host_hits[256][3],host_hit_count;
__attribute__((export_name("orbit_hit_ptr"))) int orbit_hit_ptr(void){return(int)host_hits;}
__attribute__((export_name("orbit_hit_count"))) int orbit_hit_count(void){return host_hit_count;}
__attribute__((export_name("orbit_hit_clear"))) void orbit_hit_clear(void){host_hit_count=0;}
static void orbit_weapon_collision_cb(ELEMENT*a,POINT*b,ELEMENT*c,POINT*d){int before=c->hit_points;weapon_collision(a,b,c,d);int delta=before-c->hit_points;if(delta>0&&host_hit_count<256){host_hits[host_hit_count][0]=(int)a;host_hits[host_hit_count][1]=(int)c;host_hits[host_hit_count++][2]=delta;}}
__attribute__((export_name("orbit_host_shot"))) int orbit_host_shot(int x,int y,int vx,int vy,int damage,int hp,int life){ELEMENT*e=AllocElement();if(!e)return 0;e->pParent=&ships[0];e->playerNr=0;e->state_flags=APPEARING|FINITE_LIFE|IGNORE_SIMILAR;e->hit_points=hp;e->mass_points=damage;e->life_span=life;e->current.location=(POINT){WRAP_X(x+orbit_scroll_x),WRAP_Y(y+orbit_scroll_y)};e->current.image.farray=ships[0].RaceDescPtr->ship_data.weapon;e->current.image.frame=e->current.image.farray[0];SetPrimType(&DisplayArray[e->PrimIndex],STAMP_PRIM);SetVelocityComponents(&e->velocity,vx,vy);e->collision_func=orbit_weapon_collision_cb;SetUpElement(e);PutElement(e);return(int)e;}
__attribute__((export_name("orbit_heal"))) void orbit_heal(int slot,int crew){ELEMENT*e=ships[slot].hShip;if(e&&crew>e->crew_level)DeltaCrew(e,crew-e->crew_level);}
__attribute__((export_name("orbit_ship_stat"))) int orbit_ship_stat(int slot,int field){STARSHIP*s=&ships[slot];if(!s->hShip)return 0;RACE_DESC*r=s->RaceDescPtr;switch(field){case 0:return r->ship_info.max_energy;case 1:return r->ship_info.max_crew;case 2:return r->characteristics.max_thrust;case 3:return r->characteristics.thrust_increment;case 4:return r->ship_info.ship_flags;case 5:return r->characteristics.turn_wait;case 6:return r->characteristics.thrust_wait;case 7:return r->characteristics.weapon_wait;case 8:return r->characteristics.weapon_energy_cost;case 9:return r->characteristics.special_wait;case 10:return r->characteristics.special_energy_cost;}return 0;}
void orbit_record_sound(SOUND sound,ELEMENT*e){if(sound_size>=256)return;STARSHIP*s=e?e->pParent:NULL;int slot=s>=ships&&s<ships+32?(int)(s-ships):-1;sound_events[sound_size][0]=slot;sound_events[sound_size][1]=sound?(int)(uintptr_t)sound-1:0;sound_events[sound_size++][2]=(int)e;}

__attribute__((export_name("orbit_player_delta"))) int orbit_player_delta(void){int d=player_delta;player_delta=0;return d;}
__attribute__((export_name("orbit_asteroids"))) void orbit_asteroids(int count){for(int i=0;i<count;i++)spawn_asteroid(NULL);}
__attribute__((export_name("orbit_manual_tick"))) void orbit_manual_tick(void){orbit_queue_tick();}
static int host_shield,host_invulnerable;
static void orbit_player_collision(ELEMENT*e,POINT*pt,ELEMENT*other,POINT*op){if((other->state_flags&FINITE_LIFE)&&other->mass_points&&host_shield>0){int absorb=other->mass_points<host_shield?other->mass_points:host_shield;host_shield-=absorb;other->mass_points-=absorb;}collision(e,pt,other,op);}
static COUNT orbit_player_gun(ELEMENT*e,HELEMENT out[]){return 0;}
__attribute__((export_name("orbit_player_profile"))) void orbit_player_profile(int max,int inc,int turn,int wait){STARSHIP*s=&ships[0];ELEMENT*e=s->hShip;RACE_DESC*r=s->RaceDescPtr;r->characteristics.max_thrust=max;r->characteristics.thrust_increment=inc;r->characteristics.turn_wait=turn;r->characteristics.thrust_wait=wait;r->characteristics.ship_mass=4;r->ship_info.ship_flags=FIRES_FORE;r->cyborg_control.ManeuverabilityIndex=0;r->init_weapon_func=orbit_player_gun;e->mass_points=4;e->preprocess_func=ship_preprocess;e->postprocess_func=ship_postprocess;e->collision_func=orbit_player_collision;e->death_func=NULL;e->state_flags=PLAYER_SHIP|IGNORE_SIMILAR;}
__attribute__((export_name("orbit_player_vitals"))) void orbit_player_vitals(int crew,int shield,int unlimited){STARSHIP*s=&ships[0];ELEMENT*e=s->hShip;if(!e)return;host_shield=shield;host_invulnerable=unlimited;e->crew_level=s->RaceDescPtr->ship_info.crew_level=crew;if(crew>0){e->life_span=unlimited?NORMAL_LIFE+1:NORMAL_LIFE;e->state_flags&=~(DISAPPEARING|NONSOLID);}}
__attribute__((export_name("orbit_player_shield"))) int orbit_player_shield(void){return host_shield;}
