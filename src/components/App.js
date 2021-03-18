import React, { Component } from 'react';
import { ReactSVG } from 'react-svg'
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json'


class App extends Component {

  constructor(props){
    super(props)
    this.state={
      account:'',
      contract: null,
      totalSupply: 1,
      svg:'', 
      colors: []
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
    // console.log("A")
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts() //gets accout from metamask
    this.setState({ account: accounts[0] })//state store property values of a componet and when the state chages the componet re-renders
        // console.log("B",accounts[0])
    const networkId = await web3.eth.net.getId() //detercts the eth network 
        // console.log("C",networkId)
    const networkData = Color.networks[networkId] //gets the contracts address on the network
        // console.log("D")
    console.log("netowrkdata",networkId)
    if(networkData) {//if it has an addres
      const abi = Color.abi //creates a JS version of the contract with its abi
      const address = networkData.address //its actual address?
      console.log("networkData:",networkData);
      console.log("addy",address);
      console.log("abi:",abi);

      const returnContract = new web3.eth.Contract(abi, address)//creates a new version of this contract
      // web3.eth.defaultAccount(address);
      // const returnContract = new web3.eth.Contract(abi);
      this.setState({ contract:returnContract })//sets it in state obj
      // console.log("contractName:",returnContract.contractName);
      console.log("contract:",this.state.contract)
      console.log("calling test return")
      const testreturn=returnContract.methods.testReturn("this is a test").call({from: this.state.account})
      console.log("testreturn ",testreturn)
      console.log("calling totalssupply")
      const returntotalSupply = await returnContract.methods.totalSupply().call()//calls a contracts method
      var returnSVG = await returnContract.methods.generateSVG().call()
      this.setState({svg:returnSVG})
      // const tmp="<svg><circle cx="50" cy="50" r="20" fill="#ff0000" stroke-width="9" stroke="black"/></svg>"

      // this.setState({svg:"<svg width='100' height='100'><circle cx='50' cy='50' r='20' fill='#ffff00' stroke-width='9' stroke='black'/></svg>"})
      console.log("SVG: ",this.state.svg)


      returnContract.events.SVGgenerated()
      .on('data', (event) => {
        console.log("SVG EVENT ",event);
      })
      .on('error', console.error)

      returnContract.events.PixelChanged()
      .on('data', (event) => {
        console.log("PIXEL CHANGED EVENT ",event);
      })
      .on('error', console.error)
// const junk= await returnContract.methods.getjunk().call()
// console.log("junk ",junk)
// const mintreturn= await returnContract.methods.mint("poop").call()
// console.log("mintreturn ",mintreturn)

      console.log("returntotalsupply",returntotalSupply.toString())
      console.log("state total supply",this.state.totalSupply)
      this.setState({ totalSupply:returntotalSupply }) //sets state var

      returnContract.events.Transfer()
      .on('data', (event) =>{console.log("GOT EVENT");console.log(event);})
      .on('error',console.error);

      returnContract.getPastEvents('PixelChanged', {
          fromBlock: 0,
          toBlock: 'latest'
      }, function(error, events){ console.log(events); })
      .then(function(events){
          console.log(events) // same results as the optional callback above
      });


      returnContract.getPastEvents('SVGgenerated', {
          fromBlock: 0,
          toBlock: 'latest'
      }, function(error, events){ 
          console.log(events); 
          // returnSVG= returnContract.methods.generateSVG().call();
          // this.setState({svg:returnSVG});

         })
      .then(function(events){
          console.log(events) // same results as the optional callback above
      });



      // Load Colors
      for (var i = 1; i <= returntotalSupply; i++) {
        const color = await returnContract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
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

setPixelColor = (n, color) =>{
  this.state.contract.methods.setPixel(n, color)
  .send({from: this.state.account, gas:3000000})

}
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
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Color Tokens
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
              <h1>Issue Token</h1>
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
        <h1>JUNK</h1>
         <div dangerouslySetInnerHTML={{__html: this.state.svg }} />;

        // return({this.state.svg})
 
        // <h1>more 2JUNK</h1>
        // <svg width='100' height='100'>
        // <circle cx='50' cy='50' r='20' fill='#ffff00' stroke-width='9' stroke='black'/>
        // </svg>
        <hr/>
        <div className="row text-center">

          { this.state.colors.map((color, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: color }}></div>
                <div>{color}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
 }
  // render() {
  //   return (
  //     <div>
  //       <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
  //         <a
  //           className="navbar-brand col-sm-3 col-md-2 mr-0"
  //           href="http://www.TheEverbright.com"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Etherbright
  //         </a>
  //       </nav>
  //       <div className="container-fluid mt-5">
  //         <div className="row">
  //           <main role="main" className="col-lg-12 d-flex text-center">
  //             <div className="content mr-auto ml-auto">
  //               <a
  //                 href="http://www.TheEverbright.com"
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 <img src={logo} className="App-logo" alt="logo" />
  //               </a>
  //               <h1>Etherbright Beta</h1>
  //               <p>
  //                 Edit <code>src/components/App.js</code> and save to reload.
  //               </p>
  //               <a
  //                 className="App-link"
  //                 href="http://www.TheEverbright.com"
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 Etherbright!
  //               </a>
  //             </div>
  //           </main>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}
export default App;
