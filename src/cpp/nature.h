#ifndef TEX_H
#define TEX_H

#include <windows.h>
#include <GL/glut.h>
#include <iostream>
#include <stdlib.h>
#include <math.h>
#include <time.h>

#define grass_number 2048
#define grass_range  8

#define branch_number 4096
#define branch_sub  4
#define branch_leaf 5

#define branch_size   0.17
#define branch_size_d 0.03

#define branch_length   1.50
#define branch_length_d 0.04

#define branch_rotate 50

#define PI 3.14159265

GLUquadricObj *cyl;

//==============================EARTH==============================

void earth()
{
glColor3f(0.0, 0.5, 0.0);
glBegin(GL_QUADS);
glVertex3f(-grass_range,  grass_range, 0.0);
glVertex3f(-grass_range, -grass_range, 0.0);
glVertex3f( grass_range, -grass_range, 0.0);
glVertex3f( grass_range,  grass_range, 0.0);
glEnd();
}

//==============================GRASS==============================

void blade()
{
glBegin(GL_TRIANGLE_STRIP);
glVertex3f( 0.10,  0.0, 0.0);
glVertex3f(-0.10,  0.0, 0.0);
glVertex3f( 0.08, 0.036, 0.1);
glVertex3f(-0.06, 0.108, 0.2);
glVertex3f( 0.04, 0.216, 0.3);
glVertex3f(-0.02, 0.324, 0.4);
glVertex3f( 0.00, 0.45, 0.5);
glEnd();
}

void bunch()
{
glPushMatrix();

blade();

glRotatef(45.0, 0.0, 0.0, 1.0);
blade();

glRotatef(75.0, 0.0, 0.0, 1.0);
blade(); 

glRotatef(60.0, 0.0, 0.0, 1.0);
glRotatef(15.0, 0.0, 1.0, 0.0);
blade();

glRotatef(30.0, 0.0, 0.0, 1.0);
blade();

glRotatef(90.0, 0.0, 0.0, 1.0);
glRotatef(15.0, 0.0, 1.0, 0.0);
blade();

glPopMatrix();
}

class Lawn {
   public:
      float tra_x[grass_number];
      float tra_y[grass_number];
      float rot_z[grass_number];
      float color[grass_number];
      float scale[grass_number];
      void paint(bool details);
      Lawn(); 
};

void Lawn::paint(bool details){
int i;
for (i=0;i<grass_number;i++)
    {
    glPushMatrix();
    glColor3f(0.0, color[i], 0.0);       
    glTranslatef(tra_x[i], tra_y[i], 0.0);
    glRotatef(rot_z[i], 0.0, 0.0, 1.0);
    glScalef(scale[i], scale[i], scale[i]);
    if (details) bunch(); else blade();
    glPopMatrix();
    }                
};

Lawn::Lawn(){
int i; float r;
r = grass_range - 0.2;
for (i=0;i<grass_number;i++)
    {
    tra_x[i] = ((float)rand()*(r*2) / RAND_MAX)-r;
    tra_y[i] = ((float)rand()*(r*2) / RAND_MAX)-r;    
    rot_z[i]= ((float)rand()*360 / RAND_MAX);
    color[i] = ((float)rand()*0.4 / RAND_MAX)+0.3;
    scale[i] = ((float)rand()*0.5 / RAND_MAX)+0.5;
    }
};    


//==============================BRANCH==============================

void leaf(){
glBegin(GL_TRIANGLE_FAN);
glVertex3f( 0.0, 0.0, 0.0);
glVertex3f( 0.025, 0.0, 0.02);
glVertex3f( 0.03, 0.0, 0.02);
glVertex3f( 0.04, 0.0, 0.02);
glVertex3f( 0.05, 0.0, 0.025);
glVertex3f( 0.06, 0.0, 0.03);
glVertex3f( 0.07, 0.0, 0.06);
glVertex3f( 0.08, 0.01, 0.09);
glVertex3f( 0.08, 0.02, 0.1);
glVertex3f( 0.07, 0.03, 0.12);
glVertex3f( 0.05, 0.04, 0.15);
glVertex3f( 0.03, 0.05, 0.18);
glVertex3f( 0.0, 0.06, 0.2);

glVertex3f( -0.03, 0.05, 0.18);
glVertex3f( -0.05, 0.04, 0.15);
glVertex3f( -0.07, 0.03, 0.12);
glVertex3f( -0.08, 0.02, 0.1);
glVertex3f( -0.08, 0.01, 0.09);
glVertex3f( -0.07, 0.0, 0.06);
glVertex3f( -0.06, 0.0, 0.03);
glVertex3f( -0.04, 0.0, 0.02);
glVertex3f( -0.03, 0.0, 0.02);
glVertex3f( -0.025, 0.0, 0.02);
glVertex3f( 0.0, 0.0, 0.0);
glEnd();
};

class branch {
   public:
      float rot_x, rot_z, size_b, size_t, length;
      int sub_num;      
      int sub[branch_sub];      
      int leaf_num;
      float leaf_t, leaf_r[branch_leaf];      
      branch();
      branch grow_branch(int n);
      void grow_leaves();      
      void paint(bool t, bool Leaf);
};


branch::branch(){
rot_z = 0;
rot_x = 0;
size_b = branch_size;
size_t = branch_size-branch_size_d;
length = branch_length;
sub_num = 0;
leaf_num = 0;
}

branch branch::grow_branch(int n){
branch r;
r.rot_z = rand() % 360;
r.rot_x = rand() % branch_rotate;
r.size_b = size_t;
r.size_t = size_t - branch_size_d;
r.length = length - branch_length_d;
r.grow_leaves();
sub[sub_num] = n;
sub_num++;
return r;
}

branch branches[branch_number];

void branch::grow_leaves(){
int i;
leaf_num = int(branch_size/size_b);
if (leaf_num<2) leaf_num=0;
if (leaf_num>branch_leaf) leaf_num=branch_leaf;
leaf_t=length/leaf_num;
for (i=0;i<leaf_num;i++){
    leaf_r[i]=((float)rand()*360 / RAND_MAX);
    }
}

void branch::paint(bool t, bool Leaf){
int j;
float k;
glPushMatrix();
glRotatef(rot_z, 0.0, 0.0, 1.0);
glRotatef(rot_x, 1.0, 0.0, 0.0);
if (t)
   {
   glColor3f(0.6, 0.4, 0.0);
   glEnable(GL_TEXTURE_2D);
   gluCylinder(cyl, size_b, size_t, length, 8, 8);
   glDisable(GL_TEXTURE_2D);
   }
if ( (Leaf)&&(leaf_num>0) )
{
   glColor3f(1.0, 0.4, 1.0);
   glPushMatrix();
   glTranslatef(size_t, 0.0, 0.0);   
   for (j=0;j<leaf_num;j++)
   {
      glTranslatef(0.0, 0.0, leaf_t);
      glRotatef(leaf_r[j], 0.0, 0.0, 1.0);
      leaf();
   }
   glPopMatrix(); 
}
glTranslatef(0.0, 0.0, length);
for (j=0;j<sub_num;j++) 
    {branches[sub[j]].paint(t,Leaf);}
glPopMatrix();
}

//==============================TREE==============================

class tree {
   public:
      tree();
      void grow();      
      void paint(bool b, bool leaves);
};

tree::tree(){
branch branches[1];
cyl = gluNewQuadric();
gluQuadricTexture(cyl, true);
gluQuadricNormals(cyl,GLU_NONE);  //u mnie na kompie dzia�a tylko to
//gluQuadricNormals(cyl,GLU_FLAT);
//gluQuadricNormals(cyl,GLU_SMOOTH);
}

void tree::grow(){
int i, sub=1, branch=0;
while (sub<(branch_number-branch_sub))
{
      for (i=0;i<branch_sub;i++) 
          {branches[sub+i] = branches[branch].grow_branch(sub+i);}
      branch++;
      sub += branch_sub;
}
}

void tree::paint(bool b, bool leaves){
branches[0].paint(b, leaves);
};

//===================BUTTERFLY====================
#define num 10

float abso(float a)
  {
      if (a<0) a*=-1;
      return a;
  }

class butterfly
      {
      public:
      float pos[3], start[3], end[3], mov[3], tmp[3];
      float wings, wings_d, d, l;         
      butterfly();      
      void skrzydlo(float r, float g, float b);
      void paint(float r, float g, float b, int p);
      void move(); 
      float obrot;
      int s;
      };

butterfly::butterfly()
{
pos[0]=pos[1]=pos[2]=0.0;
start[0]=start[1]=start[2]=-1.0;
end[0]=  end[1]=  end[2]=0.0;
mov[0]=  mov[1]=  mov[2]=0.01;
wings=0.0; wings_d=-2.0; d=1.0;
obrot = 0;
}

void butterfly::paint(float r,float g, float b, int p)
{
s=p;
move();
glPushMatrix();
if (s==1){
          glRotatef(180,0.0,0.0,1.0);
          } 
glTranslatef(pos[0],pos[1],pos[2]);
glRotatef(obrot-90, 0.0, 0.0, 1.0);


glPushMatrix();
glRotatef(wings, 0.0, 1.0, 0.0);
skrzydlo(r,g,b);
glPopMatrix();

glPushMatrix();
glRotatef(180-wings, 0.0, 1.0, 0.0);
skrzydlo(r,g,b);
glPopMatrix();

glPopMatrix();
}


void butterfly::skrzydlo(float r,float g, float b)
{
    glColor3f(r*0.5, g*0.0, b*0.2);
	glBegin(GL_TRIANGLE_FAN);
	glVertex3f( 0.0, 0.0, 0.0);
    glVertex3f( 0.0, 0.2, 0.0);
    glColor3f(r*1.0, g*0.9, b*0.0);    
    glVertex3f( 0.1, 0.25, 0.0);
	glVertex3f( 0.25, 0.25, 0.0);
    glColor3f(r*0.9, g*0.7, b*0.2);
	glVertex3f( 0.35, 0.2, 0.0);
    glColor3f(r*0.9, g*0.7, b*0.2); 
	glVertex3f( 0.35, 0.1, 0.0);    
    glColor3f(r*0.8, g*0.7, b*0.0); 
	glVertex3f( 0.3, 0.0, 0.0);
	glColor3f(r*0.0, g*0.0, b*1.0); 
	glVertex3f( 0.25,-0.05, 0.0);
    glColor3f(r*0.9, g*0.7, b*0.0); 
	glVertex3f( 0.2,-0.15, 0.0);
	glColor3f(r*1.0, g*0.8, b*0.0); 
	glVertex3f( 0.15,-0.2, 0.0);
    glColor3f(r*1.0, g*0.9, b*0.0); 
	glVertex3f( 0.05,-0.2, 0.0);
    glColor3f(r*1.0, g*1.0, b*0.0); 
	glVertex3f( 0.0,-0.1, 0.0);
  	glEnd();
}

void butterfly::move()
{
if (
   ( (abso(end[0]-pos[0])<=abso(mov[0])) ) || 
   ( (abso(end[1]-pos[1])<=abso(mov[1])) ) ||
   ( (abso(end[2]-pos[2])<=abso(mov[2])) )
   )
{

tmp[0]= ((float)rand()*8/RAND_MAX);
tmp[1]= ((float)rand()*8/RAND_MAX);
tmp[2]= ((float)rand()*4/RAND_MAX)+3;
if ((rand()%4)<=1) tmp[0]*=-1;

   start[0]=end[0];
   start[1]=end[1];
   start[2]=end[2];
    
   end[0]=tmp[0];
   end[1]=tmp[1];   
   end[2]=tmp[2];   
   
   mov[0]=end[0]-start[0];
   mov[1]=end[1]-start[1];
   mov[2]=end[2]-start[2];
   
   obrot = atan2(mov[1],mov[0]) * 180 / PI;
   l=sqrt(mov[0]*mov[0]+mov[1]*mov[1]+mov[2]*mov[2]);

   mov[0]=mov[0]/l;
   mov[1]=mov[1]/l;
   mov[2]=mov[2]/l; 
   
   mov[0]/=5.0;     
   mov[1]/=5.0;
   mov[2]/=5.0;      
   }   
pos[0]+=mov[0];
pos[1]+=mov[1];
pos[2]+=mov[2];

wings+=wings_d;
if (wings>60) wings_d*=-1;
else if (wings<-30) wings_d*=-1;

};


//====================================TEXTURE======================================



const int  BITMAP_ID=0x4D42;
void* imageData;	

unsigned char *bitmapData=0;

GLuint texture;

BITMAPINFOHEADER bih;

unsigned char * LoadBitmapFile(char *filename, BITMAPINFOHEADER *bitmapInfoHeader)
{
	FILE *filePtr;
	BITMAPFILEHEADER bitmapFileHeader;
	unsigned char *bitmapImage;
	int imageIdx =0;
	unsigned char tempRGB;

	filePtr = fopen(filename, "rb");
	if (filePtr == NULL) return NULL;
		
	fread(&bitmapFileHeader, sizeof(BITMAPFILEHEADER),1,filePtr);

	if (bitmapFileHeader.bfType !=BITMAP_ID)
	{
		fclose(filePtr);
		return NULL;
	}

	fread(bitmapInfoHeader, sizeof(BITMAPINFOHEADER),1, filePtr);

	fseek(filePtr,bitmapFileHeader.bfOffBits, SEEK_SET);

	bitmapImage = (unsigned char *)malloc(bitmapInfoHeader->biSizeImage);

	if (!bitmapImage)
	{
		free(bitmapImage);
		fclose(filePtr);
		return NULL;
	}

	fread(bitmapImage,1,bitmapInfoHeader->biSizeImage,filePtr);

	if (bitmapImage == NULL)
	{
		fclose(filePtr);
		return NULL;
	}

	for (imageIdx =0; imageIdx < bitmapInfoHeader->biSizeImage; imageIdx+=3)
	{
		tempRGB = bitmapImage[imageIdx];
		bitmapImage[imageIdx]=bitmapImage[imageIdx+2];
		bitmapImage[imageIdx+2]=tempRGB;
	}

	fclose(filePtr);
	return bitmapImage;
}


int WriteBitmapFile(char *filename, int width, int height, unsigned char *imageData)
{
	FILE			 *filePtr;			// wska�nik pliku
	BITMAPFILEHEADER bitmapFileHeader;	// nag��wek pliku
	BITMAPINFOHEADER bitmapInfoHeader;	// nag��wek obrazu
	int				 imageIdx;			// indeks obrazu
	unsigned char	 tempRGB;			// zmienna zamiany sk�adowych

	// otwiera plik do zapisu w trybie "writing binary"
	filePtr = fopen(filename, "wb");
	if (!filePtr)
		return 0;

	// definiuje nag��wek pliku
	bitmapFileHeader.bfSize = sizeof(BITMAPFILEHEADER);
	bitmapFileHeader.bfType = 0x4D42;
	bitmapFileHeader.bfReserved1 = 0;
	bitmapFileHeader.bfReserved2 = 0;
	bitmapFileHeader.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);
	
	// definiuje nag��wek mapy bitowej
	bitmapInfoHeader.biSize = sizeof(BITMAPINFOHEADER);
	bitmapInfoHeader.biPlanes = 1;
	bitmapInfoHeader.biBitCount = 24;						// 24-bitowy
	bitmapInfoHeader.biCompression = BI_RGB;				// bez kompresji
	bitmapInfoHeader.biSizeImage = width * abs(height) * 3;	// width * height * (bajty RGB)
	bitmapInfoHeader.biXPelsPerMeter = 0;
	bitmapInfoHeader.biYPelsPerMeter = 0;
	bitmapInfoHeader.biClrUsed = 0;
	bitmapInfoHeader.biClrImportant = 0;
	bitmapInfoHeader.biWidth = width;						// szeroko�� mapy
	bitmapInfoHeader.biHeight = height;						// wysoko�� mapy

	// zamienia format danych z RGB na BGR
	for (imageIdx = 0; imageIdx < bitmapInfoHeader.biSizeImage; imageIdx+=3)
	{
		tempRGB = imageData[imageIdx];
		imageData[imageIdx] = imageData[imageIdx + 2];
		imageData[imageIdx + 2] = tempRGB;
	}

	// zapisuje nag��wek pliku
	fwrite(&bitmapFileHeader, 1, sizeof(BITMAPFILEHEADER), filePtr);

	// zapisuje nag��wek mapy bitowej
	fwrite(&bitmapInfoHeader, 1, sizeof(BITMAPINFOHEADER), filePtr);

	// zapisuje dane mapy bitowej
	fwrite(imageData, 1, bitmapInfoHeader.biSizeImage, filePtr);

	// zamyka plik
	fclose(filePtr);

	return 1;
}



 void setTexture(char *filename, GLenum f )
{
  unsigned int texture;	
  unsigned char *bitmapData;
  BITMAPINFOHEADER bitmapInfoHeader;

  
  bitmapData = LoadBitmapFile(filename,&bitmapInfoHeader);
  if (bitmapData!=0) glGenTextures(1,&texture); 
  //glEnable(GL_TEXTURE_2D);
  glBindTexture(GL_TEXTURE_2D,texture);	
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
  glTexEnvi(GL_TEXTURE_ENV,GL_TEXTURE_ENV_MODE,f);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, bitmapInfoHeader.biWidth,bitmapInfoHeader.biHeight, 0, GL_RGB, GL_UNSIGNED_BYTE, bitmapData);
  		
}

#endif
