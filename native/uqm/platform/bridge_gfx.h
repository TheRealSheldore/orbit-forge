#ifndef ORBIT_BRIDGE_GFX_H
#define ORBIT_BRIDGE_GFX_H
#include "libs/gfxlib.h"
typedef struct {int w,h;const unsigned char *bits;} TFB_Image;
struct frame_desc {UWORD Type,Index;HOT_SPOT HotSpot;EXTENT Bounds;TFB_Image *image;struct drawable_desc *parent;int group;};
struct drawable_desc {CREATE_FLAGS Flags;UWORD MaxIndex;FRAME_DESC *Frame;};
typedef struct {RECT Box;FRAME FramePtr;} IMAGE_BOX;
#define GetFrameWidth(f) ((f)->Bounds.width)
#define GetFrameHeight(f) ((f)->Bounds.height)
#define ContextActive() 1
BOOLEAN TFB_DrawImage_Intersect(TFB_Image*,POINT,TFB_Image*,POINT,const RECT*);
FRAME orbit_resource(const char*);
#endif
