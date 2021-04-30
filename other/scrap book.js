               this.state.pixels.map(pix => (this.getCircle(pix.xpos,p.ypos,p.color) )
this.getCircle(20,20,"#00ff00")

            <svg width='300' height='300'>
            <circle cx='60' cy='90' r='20' fill='#93hf93' stroke-width='9' stroke='black'/>
            </svg>




                            <div dangerouslySetInnerHTML={{__html: this.state.svg }} />
                <div dangerouslySetInnerHTML={{__html: this.state.svg }} />



                          var xoff=50;
               var yoff=50;
                var p=0;
                var pixels=[];
                for(var x=1; x<=5; x++){
                  for(var y=1; y<=5; y++){
                    pixels.push(new Pixel(p,xoff*x,yoff*y,pixelColors[p]))
                    p++;
                  }
                }
              ethb.pixels=pixels;