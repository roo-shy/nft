import React, { Component } from 'react';
// import { ReactSVG } from 'react-svg'
// import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json'
import { CirclePicker } from 'react-color';


function Etherbright(id, xpos,ypos, pixels, pallet, svg, mode, owner ){
  this.id=id;
  this.owner=owner;
  this.svg=svg;
  this.mode=0;
  this.pixels=pixels;
  this.pallet=pallet;
  this.xpos=xpos;
  this.ypos=ypos;

}
function Pixel(id,xpos,ypos,color){
  this.id=id;
  this.xpos=xpos;
  this.ypos=ypos;
  this.color=color;
}


    
// function  svgonclick(e,id){
//   console.log("Color ",e.target.getAttributeNS(null,"fill"));
//   console.log("ID ",e.target.getAttributeNS(null,"id"));
//   window.App.setEtherbrightPixelColor(e.target.getAttributeNS(null,"id"),0,0);

// };

function generateSvg(id, pixels){
  var header="<svg width='300' height='300'>";
  var footer="</svg>";
  // var body
  var xoff=50;
  var yoff=50;
  var p=0;
  // for(var p=0; p<24; p++){
  //   var c=pixels[p];
  //   var e="<circle id={this.state.id.toHexString()} cx='"+p+"' cy='50' r='20' fill="+c+" strokeWidth='9' stroke='black' onClick  ={(e) => {this.props.testsvg(e) ;}}/>";
  //   header=header.concat(e);
  // }
    for(var x=1; x<=5; x++){
      for(var y=1; y<=5; y++){
        // console.log("x:",x," y:",y," p:",p," c:",c);
        var c=pixels[p];
        var e="<circle id='"+id+"' cx='"+xoff*x+"' cy='"+yoff*y+"' r='20' fill="+c+" strokeWidth='10' stroke='black' onClick  ='{(e) => {this.props.testsvg(e);}}'/>";
        header=header.concat(e);
        p++;
      } 
    }
  header=header.concat("</svg>");
  return header;
// console.log("generateSVG  ",header)

}
  

class App extends Component {


  constructor(props){
    super(props)
    this.state={
      account:'',
      contract: null,
      totalSupply: 1,
      svg:'', 
      colors: [],
      etherbrights: [],
      etherbrightIDs: [],
      allSVGs: [],

    }

  }

  async loadWeb3() {
      console.log("loadWeb3");

    if (window.ethereum) {
            console.log("loadWeb3  ETH");

      // window.web3 = new Web3(window.ethereum)
            window.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

      await window.ethereum.enable()
    }
    else if (window.web3) {
                  console.log("loadWeb3  WEB3");

      // window.web3 = new Web3(window.web3.currentProvider)
      window.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async componentWillMount() {
    console.log("loadingWeb3")
    await this.loadWeb3()
    console.log("loadBlockchainData")
    await this.loadBlockchainData()
  }



  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts() //gets accout from metamask
    this.setState({ account: accounts[0] })//state store property values of a componet and when the state chages the componet re-renders
    const networkId = await web3.eth.net.getId() //detercts the eth network 
    const networkData = Color.networks[networkId] //gets the contracts address on the network
    console.log("netowrkdata",networkId)
    if(networkData) {//if it has an addres
      const abi = Color.abi //creates a JS version of the contract with its abi
      const address = networkData.address //its actual address?
      console.log("networkData:",networkData);
      console.log("addy",address);
      console.log("abi:",abi);

      const returnContract = new web3.eth.Contract(abi, address)//creates a new version of this contract
      this.setState({ contract:returnContract })//sets it in state obj
      console.log("contract:",this.state.contract)
      // console.log("calling test return")
      // const testreturn=returnContract.methods.testReturn("this is a test").call({from: this.state.account})
      // console.log("testreturn ",testreturn)
      console.log("calling totalssupply")
      const returntotalSupply = await returnContract.methods.totalSupply().call()//calls a contracts method
      console.log("returntotalsupply",returntotalSupply.toString())
      console.log("state total supply",this.state.totalSupply)
      this.setState({ totalSupply:returntotalSupply }) //sets state var
      // var returnSVG = await returnContract.methods.generateSVG().call()
      // this.setState({svg:returnSVG})
      // const tmp="<svg><circle cx="50" cy="50" r="20" fill="#ff0000" stroke-width="9" stroke="black"/></svg>"

      // this.setState({svg:"<svg width='100' height='100'><circle cx='50' cy='50' r='20' fill='#ffff00' stroke-width='9' stroke='black'/></svg>"})
      // console.log("SVG: ",this.state.svg)

      returnContract.events.Selector()
      .on('data', (event) => {
        console.log("SELECTOR: ",event.returnValues[0]);
      })
      .on('error', console.error)

      // returnContract.events.SVGgenerated()
      // .on('data', (event) => {
      //   console.log("SVG EVENT ",event);
      //   this.setState({svg:event.returnValues[0]})
      // })
      // .on('error', console.error)

      // returnContract.events.EtherbrightSVGgenerated()
      // .on('data', (event) => {
      //   console.log("ETHB SVG EVENT ",event);
      //   // this.setState({svg:event.returnValues[0]})
      // })
      // .on('error', console.error)

      returnContract.events.EtherbrightPixelChanged()
      .on('data', (event) => {
        console.log("ETHB PIXEL CHANGED EVENT ",event);
          // returnContract.methods.generateEtherbrightsSVG(event.returnValues[0]).call()
          //   .then(function(result){console.log(result)})

        for (var index = 0; index < this.state.etherbrights.length; index++) {
          console.log("index ",index);
          console.log("state ID ",this.state.etherbrights[index].id.toHexString());
          console.log("token id ",event.returnValues[0].toHexString());

          if (this.state.etherbrights[index].id.toHexString() === event.returnValues[0].toHexString()) {
            console.log("THIS IS IT")
            break;
          }
        }

        var _etherbrights = Object.assign(this.state.etherbrights);
        var tmp;
        var pixN=event.returnValues[1];
        // _etherbrights[index].svg=event.returnValues[1]
        _etherbrights[index].pixels[pixN].color=event.returnValues[3];

        console.log("tmp result ",tmp );
        this.setState({etherbrights  :[] });
          this.setState({etherbrights:_etherbrights });

              // this.setMethod(_etherbrights);



        // this.state.etherbrights.map(ethb =>{
        //   if(ethb.id=event.returnValues[0]){

        //     // console.log("THIS IS IT", index);
        //     var returnSVG =  returnContract.methods.generateEtherbrightsSVG(event.returnValues[0]).call()
        //     // this.setState()
        //     // let tmparray=this.state.etherbrights.slice();
        //     // tmparray[id][svg]=returnSVG;
        //     // setarray(tmparray);

        //   }

        //   }
        //   )

      })
      .on('error', console.error)

      // returnContract.events.PixelChanged()
      // .on('data', (event) => {
      //   console.log("PIXEL CHANGED EVENT ",event.returnValues[0]);

      // })
      // .on('error', console.error)



      // returnContract.events.EtherbrightMinted()
      // .on('data', (event) => {
      //   console.log("Etherbright Minted ",event);
      //     var ethb=new Etherbright(event.returnValues[0],event.returnValues[1]);
      //   this.setState({
      //     etherbrights: [...this.state.etherbrights, ethb]
      //   })
      // })
      // .on('error', console.error)
      returnContract.events.EtherbrightMinted()
      .on('data', (event) => {
        console.log("Etherbright Minted ",event);
          var id=event.returnValues[0];
          var owner=event.returnValues[1];
          console.log(" minted id ",id)

          var pixels=[];
          var svg="tmp";
          var waiting=1;
          var ethb=new Etherbright(); 
          ethb.id=id;
          ethb.owner=owner;
          var proms=[];
          var pixelColors=[];
          // returnContract.methods.getEtherbrightPallet(id).call().then(function(result){ethb.pallet=result;console.log("PALLET ",result)});
          // returnContract.methods.getEtherbrightPixels(id).call().then(function(result){pixelColors=result;console.log("PALLET ",result)});
          proms.push(returnContract.methods.getEtherbrightPallet(id).call());
          proms.push(returnContract.methods.getEtherbrightPixels(id).call());
          var allProms=Promise.all(proms);
            allProms.then((data) => {
              console.log("DATA 0",data[0])
              ethb.pallet=data[0];
              console.log("ethb.pallet ",ethb.pallet)

              console.log("ALL PROMS ID ",ethb.id); 
                var xoff=50;
               var yoff=50;
                var p=0;
                var pixels=[];
                for(var x=1; x<=5; x++){
                  for(var y=1; y<=5; y++){
                    pixels.push(new Pixel(p,xoff*x,yoff*y,data[1][p]))
                    p++;
                  }
                }
              ethb.pixels=pixels;

              console.log("PIX ",ethb.pixels);
              console.log("PALLET ",ethb.pallet);

              // ethb.svg=generateSvg(ethb.id,ethb.pixels);
              this.setState({
              etherbrights: [...this.state.etherbrights, ethb]
              })
            })

          // for(var p=0; p<24; p++){
          //  proms.push(returnContract.methods.getEtherbrightPixelColor(id,p).call())
          // }

          // var allProms=Promise.all(proms);
          //   allProms.then((data) => {

          //     console.log("ALL PROMS ID ",ethb.id); 
          //       var xoff=50;
          //      var yoff=50;
          //       var p=0;
          //       var pixels=[];
          //       for(var x=1; x<=5; x++){
          //         for(var y=1; y<=5; y++){
          //           pixels.push(new Pixel(p,xoff*x,yoff*y,data[p]))
          //           p++;
          //         }
          //       }
          //     ethb.pixels=pixels;

          //     console.log("PIX ",ethb.pixels);
          //     console.log("PALLET ",ethb.pallet);

          //     ethb.svg=generateSvg(ethb.id,ethb.pixels);
          //     this.setState({
          //     etherbrights: [...this.state.etherbrights, ethb]
          //     })
          //   })


            //     var xoff=50;
            //    var yoff=50;
            //     var p=0;
            //     var pixels=[];
            //     for(var x=1; x<=5; x++){
            //       for(var y=1; y<=5; y++){
            //         pixels.push(new Pixel(p,xoff*x,yoff*y,pixelColors[p]))
            //         p++;
            //       }
            //     }
            //   ethb.pixels=pixels;
            //   console.log("PIX ",ethb.pixels);
            //   console.log("PALLET ",ethb.pallet);

            //   ethb.svg=generateSvg(ethb.id,ethb.pixels);
            //   this.setState({
            //   etherbrights: [...this.state.etherbrights, ethb]
            // })
   
      })
      .on('error', console.error)




      returnContract.events.Transfer()
      .on('data', (event) =>{console.log("GOT EVENT");console.log(event);})
      .on('error',console.error);

      // returnContract.getPastEvents('PixelChanged', {
      //     fromBlock: 0,
      //     toBlock: 'latest'
      // }, function(error, events){ console.log(events); })
      // .then(function(events){
      //     console.log(events) // same results as the optional callback above
      // });


      // returnContract.getPastEvents('SVGgenerated', {
      //     fromBlock: 0,
      //     toBlock: 'latest'
      // }, function(error, events){ 
      //     console.log(events); 
      //     // returnSVG= returnContract.methods.generateSVG().call();
      //     // this.setState({svg:returnSVG});

      //    })
      // .then(function(events){
      //     console.log(events) // same results as the optional callback above
      // });



      // Load Colors
      // for (var i = 1; i <= returntotalSupply; i++) {
      //   const color = await returnContract.methods.colors(i - 1).call()
      //   this.setState({
      //     colors: [...this.state.colors, color]
      //   })
      // }
      // var _svgmap = new Map();
      for (var i = 1; i <= returntotalSupply; i++) {
      var ethb=new Etherbright();

        var ethbID = await returnContract.methods.tokenByIndex(i - 1).call()
        var owner =await returnContract.methods.ownerOf(ethbID).call();
        ethb.id=ethbID;
        ethb.owner=owner;
        var proms=[];
        var pixels=[];
              // console.log(" startup ALL PROMS ID 1",ethb.id); 

        // for(var p=0; p<24; p++){
        //   proms.push(returnContract.methods.getEtherbrightPixelColor(ethb.id,p).call())
        // }
        proms.push(returnContract.methods.getEtherbrightPixels(ethbID).call());
        var allProms=Promise.all(proms);
            allProms.then((data) => {

              // console.log(" startup ALL PROMS ID 2",ethbID); 
                var xoff=50;
                var yoff=50;
                var p=0;
                var pixels=[];
                for(var x=1; x<=5; x++){
                  for(var y=1; y<=5; y++){
                    pixels.push(new Pixel(p,xoff*x,yoff*y,data[0][p]))
                    p++;
                  }
                }
              ethb.pixels=pixels;
              // console.log("PIX ",ethb.pixels);
              ethb.svg=generateSvg(ethb.id,ethb.pixels);
              ethb.id=ethbID;
              ethb.owner=owner;

              this.setState({
                etherbrights: [...this.state.etherbrights, ethb]
              })
              // console.log("prom data ",data);
              // console.log("supply ",this.state.totalSupply);

              // console.log("generateSVG  ", ethb.svg)
            },ethbID)


      }
      // this.setState({SVGmap:_svgmap})
      // console.log("allsvgs",this.state.allSVGs)
      // console.log("MAP", this.state.svgmap)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }



  //javascript arrow function =>
  // () define the list of pramaters followed by "fat arrow" => and {} that delimit the functions body
  // ... is spread syntax which expands an iterable like an array or string 
  //
  // this callwebs the mint method in the contract with seend passing the accout
  // .once is a promiss event that watches for events like'receipt' and then can call a function with it
  // when we get a receipt event we call setstate and add the color we justed mined to the list
  
// //#dc34eb
//   mint = (color) => {
//     this.state.contract.methods
//         // this.state.contract

//     .mint(color)
//     .send({ from: this.state.account })
//     .once('receipt',
//        (receipt) => {
//           this.setState(
//             {
//             colors: [...this.state.colors, color]
//             }
//           )
//         }
//     )
//   }

mint = (color) => {
  this.state.contract.methods.mint(color)
  .send({from: this.state.account, gas:3000000 })//gas must be set with each call for Ganche-cli
  .on('receipt',
     (receipt) => {
      // console.log("got mints receipt")
        this.setState(
          {
          colors: [...this.state.colors, color]
          }
        )
      }
  )
}
 setMethod(newstate){
   var _etherbrights = Object.assign(this.state.etherbrights);
          _etherbrights[1].svg="<svg width='100' height='100'><circle cx='50' cy='50' r='20' fill='#ffff00' strokeWidth='9' stroke='black'/></svg>";
                  console.log("SETSTAT",_etherbrights)

  this.setState({etherbrights  :[] });
  this.setState({etherbrights:_etherbrights });
  // this.setState(this.state);
  console.log("SET METHOD");
}
mintEtherbright = ()=>{
  this.state.contract.methods.mintEtherbright(this.state.account)
  .send({from: this.state.account ,gas:3000000})
}


setPixelColor = (n, color) =>{
  this.state.contract.methods.setPixel(n, color)
  .send({from: this.state.account, gas:3000000})

}

setEtherbrightPixelColor = (id, pixn, paln) => {
  this.state.contract.methods.setEtherbrightPixel(id, pixn, paln)
  .send({from: this.state.account, gas:3000000})
}

testsvgonclick=(e,id)=>{
  console.log("Pix N ",e.target.getAttributeNS(null,"pn"))
  console.log("Color ",e.target.getAttributeNS(null,"fill"))
  console.log("ID ",e.target.getAttributeNS(null,"id"))
  // window.App.setEtherbrightPixelColor(e.target.getAttributeNS(null,"id"),0,0)

}
getAllTokenId = ()=>{
  // var nTokens=this.state.contract.methods.totalSupply().call();
  // for (var i = 0; i <nTokens; i++) {
  //   console.log("getalldis ",i)
  // }
  this.state.contract.methods.totalSupply().call()
  .then(
      function(totalSupply){
        console.log("Total Supply with a promise:",  totalSupply);
      }
      )
}

update=()=>{this.forceUpdate();
console.log(this.state.etherbrights)}
  // mint = (color) => {
  //   this.state.contract.mint(color)
  //   .call({from: this.state.account})
  //   .once('receipt',
  //      (receipt) => {
  //         this.setState(
  //           {
  //           colors: [...this.state.colors, color]
  //           }
  //         )
  //       }
  //   )
  // }



render() {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.TheEverbright.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherbright
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{this.state.account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>setPixelColor</h1>
              <form onSubmit={(event) => {
                event.preventDefault()
                const color = this.color.value
                const n = this.n.value
                this.setPixelColor(n,color)
              }}>
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='e.g. #FFFFFF'
                  ref={(input) => { this.color = input }}
                />
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='pixel number'
                  ref={(input) => { this.n = input }}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='SET PIXEL COLOR'
                />
              </form>
            </div>
          </main>
        </div>
          <hr/>
          <button onClick={this.mintEtherbright}>mint etherbright</button>
          <hr/>
          <button onClick={this.getAllTokenId}>get all token ID</button>
           <hr/>
          <button onClick={this.update}>update</button>
          {/*
          <hr/>
          <h1>JUNK</h1>
          <div dangerouslySetInnerHTML={{__html: this.state.svg }} />
          <hr/>
          <div dangerouslySetInnerHTML={{__html: this.state.allSVGs }} />
          <h1>more 2JUNK</h1>
            <svg width='100' height='100'>
            <circle cx='50' cy='50' r='20' fill='#ffff00' strokeWidth='9' stroke='black'/>
            </svg>
          <hr/>
        */}




        <div className="row text-center">


          <div>



            {this.state.etherbrights.map(ethb => (
              <div id="parent">
              <hr/>
                <EthbDisplay id={ethb.id} owner={ethb.owner} pixels={ethb.pixels} pallet={ethb.pallet} setmethod={(id,pixn,paln)=>this.setEtherbrightPixelColor(id,pixn,paln)} testsvg={(e,id)=>this.testsvgonclick(e,id)}/>
              </div>
            ))}

          </div>


        {/*  { this.state.colors.map(
            (color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })
          }
          */}
        </div>
      </div>
    </div>
  );
 }
}

class EthbDisplay extends Component{
  constructor(props){
    super(props);
    // this.testsvgonclick=this.testsvgonclick.bind(this);
    this.state={
      id: props.id,
      pixels: props.pixels,
      owner: props.owner,
      pallet: props.pallet,

    };
  }
  componentWillReceiveProps(newProps){
      this.setState({
          location: newProps.location
      })
  }
  getAllColors(){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ",this.state.pallet);
  }

  getCircle(n,x,y,c){
    return(
            <circle id={this.state.id.toHexString()} pn={n} cx={x} cy={y} r='20' fill={c} strokeWidth='8' stroke='black' onClick  ={(e) => {this.props.testsvg(e);}}/>
      )
  }
  render(){
    return(
      <div >
            <svg width='300' height='300'>
            {this.state.pixels.map(pix=>(this.getCircle(pix.id, pix.xpos, pix.ypos, pix.color) ))}
            </svg>
                      <div align="left">
            <h5>Etherbright id:</h5> <h6> {this.state.id.toHexString()}</h6>
            <br/>
            <h5>Etherbright owner:</h5> {this.state.owner}
            </div>  
              <CirclePicker colors={this.getAllColors()}/>


              

            
              <h3>setPixelColor</h3>
              <form onSubmit={(event) => {
                event.preventDefault()
                const paln = this.paln.value
                const pixn = this.pixn.value
                const id = this.state.id
                this.props.setmethod(this.state.id,pixn,paln)
              }}>
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='pixel number'
                  ref={(input) => { this.pixn = input }}
                />
                <input
                  type='text'
                  className='form-control mb-1'
                  placeholder='pallent n'
                  ref={(input) => { this.paln = input }}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='SET PIXEL COLOR'
                />
              </form>
      <button className="button" onClick={() => alert(this.state.id)}>
      </button>
          <hr/>
          </div>
      );
    }
}
export default App;
