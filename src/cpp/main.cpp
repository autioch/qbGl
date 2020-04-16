#include <windows.h>
#include "GL/glut.h"
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include "nature.h"

using namespace std;

float fovy = 60.0, aspect = 1.0, near_ = 0.1, far_ = 64.0;

float pos_x, pos_y, pos_z = 0.0, pos_d = 0.2;
float rot_x, rot_y, rot_z = 0.0, rot_d = 1.0;

float sun_pos = 0.0;
float sun_d = 0.1;

bool Earth = false;
bool Tree = false;
bool Leaf = false;
bool Grass = false;
bool Details = false;
bool Sun = false;
bool Full = false;
bool Butter = false;

GLfloat scene_ambient[] = { 0.5, 0.5, 0.5, 1.0 };
GLfloat light_pos[] = { 0.0, 0.0, 6.0, 1.0 };
GLfloat light_amb[] = { 0.5, 0.5, 0.5, 1.0 };
GLfloat light_dif[] = { 0.5, 0.5, 0.5, 1.0 };

tree tree;
Lawn lawn;
butterfly fly;
butterfly fly2;

void init()
{
glClearColor(0.7,0.8,1.0,1.0);
glEnable(GL_DEPTH_TEST);
glEnable(GL_NORMALIZE);
glColorMaterial(GL_FRONT, GL_AMBIENT_AND_DIFFUSE);
glEnable(GL_COLOR_MATERIAL);
glEnable(GL_LIGHTING);
glEnable(GL_LIGHT0);
glLightModelfv(GL_LIGHT_MODEL_AMBIENT,scene_ambient);
glLightfv(GL_LIGHT3, GL_DIFFUSE, light_dif);
glLightfv(GL_LIGHT3, GL_DIFFUSE, light_amb);
setTexture("texture.bmp",GL_REPLACE );
}

void reshape(int width, int height)
{
float  h = float(height), w = float(width);
glViewport(0, 0, width, height);
glMatrixMode(GL_PROJECTION);
glLoadIdentity();
gluPerspective(fovy, w/h, near_, far_);
glMatrixMode(GL_MODELVIEW);
}

void keyboard(unsigned char key_code, int x, int y)
{
   switch (key_code) {
   case 'w': case 'W': pos_x += pos_d; break;
   case 's': case 'S': pos_x -= pos_d; break;
   case 'a': case 'A': pos_y += pos_d; break;
   case 'd': case 'D': pos_y -= pos_d; break;
   case 'z': case 'Z': pos_z += pos_d; break;
   case 'c': case 'C': pos_z -= pos_d; break;
   case 'b': case 'B': rot_x += rot_d; break;
   case 'm': case 'M': rot_x -= rot_d; break;
   case 'y': case 'Y': rot_y += rot_d; break;
   case 'h': case 'H': rot_y -= rot_d; break;
   case 'g': case 'q': case 'G': case 'Q': rot_z += rot_d; break;
   case 'j': case 'e': case 'J': case 'E': rot_z -= rot_d; break;
   case 'p': case 'P':  exit (0);
  }
};

void speckeyboard(int key_code, int x, int y)
{
  switch (key_code) {
  case GLUT_KEY_F1: Earth   = !Earth;   break;
  case GLUT_KEY_F2: Grass   = !Grass;   break;
  case GLUT_KEY_F3: Details = !Details; break;
  case GLUT_KEY_F4: Tree    = !Tree;    break;
  case GLUT_KEY_F5: Leaf    = !Leaf;    break;
  case GLUT_KEY_F6: Sun     = !Sun;    break;
  case GLUT_KEY_F7: Butter  = !Butter;  break;
  case GLUT_KEY_F8: if (Full)
                       glutReshapeWindow(400, 300);
                       else glutFullScreen();
                       Full = !Full;    break;
  }
};

void mouse(int button, int condition, int x, int y)
{
  if (condition == GLUT_DOWN)
     {
     switch (button)
            {
            case GLUT_LEFT_BUTTON:  break;
            case GLUT_RIGHT_BUTTON:  break;
            }
     }
     else if (condition == GLUT_UP)  ;
}

void animate()
{
if (Sun) {sun_pos+=sun_d;}
light_pos[0] =  6 * cos(sun_pos);
light_pos[1] =  6 * sin(sun_pos);
fly.move();
fly2.move();
glutPostRedisplay();
}

void scene()
{
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
glLoadIdentity();
gluLookAt(20.0,0.0,16.0, 0.0,0.0,0.0, 0.0,0.0,1.0);
glTranslatef(pos_x,pos_y,pos_z);
glRotatef(rot_x, 1.0, 0.0, 0.0);
glRotatef(rot_y, 0.0, 1.0, 0.0);
glRotatef(rot_z, 0.0, 0.0, 1.0);
glLightfv(GL_LIGHT0, GL_POSITION, light_pos);
if (Earth) { earth(); }
if (Grass) { lawn.paint(Details); }
tree.paint(Tree, Leaf);
if (Butter)
   {
   fly.paint(1.0,0.5,0.25,0);
   fly2.paint(0.0,0.5,0.5,1);
   }
glFlush();
glutSwapBuffers();
}

int main(int argc, char** argv)
{
cout << "Japan Cherry 1.0.\n";
cout << "Program created for Computer Science Tools studies \non University of Adam Mickiewicz in Poznan, Poland.\n";
cout << "Author: Jakub Szczepaniak, autioch@gmail.com.\n";
cout << "Press ENTER to prepare scene.                     ";
cin.get();
cout << "\n\nInitializing random generator...                        ";
srand(time(NULL));
cout << "Done.\n";
cout << "Preparing scene window...                               ";
glutInit(&argc, argv);
glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH);
glutInitWindowSize(400,300);
glutInitWindowPosition(200,200);
glutCreateWindow("Japan Cherry 1.0");
cout << "Done.\n";
cout << "Generating tree...                                      ";
tree.grow();
cout << "Done.\n";
cout << "Registering functions to display and control scene...   ";
glutDisplayFunc(scene);
glutReshapeFunc(reshape);
glutKeyboardFunc(keyboard);
glutSpecialFunc(speckeyboard);
glutMouseFunc(mouse);
glutIdleFunc(animate);
cout << "Done.\n";
cout << "Initializing OpenGL variables...                        ";
init();
cout << "Done.\n\n";
cout << "Press ENTER to start display.";
cin.get();
cout << "Scene display started.\n\n";
cout << "To close this window, close the scene window.               ";
glutMainLoop();
}
