import React, { Component } from "react";
import { View, Dimensions, PanResponder, Image, Text } from "react-native";
import PropTypes from "prop-types";
import TileMap from './TileMap';

export default class Board extends Component {
  static contextTypes = {
    scale: PropTypes.number,
    loop: PropTypes.object,
  };
  static propTypes = {
    gameBoard: PropTypes.array,
    tileWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.screenDimensions = Dimensions.get("window");
    this.sourceWidth = this.props.tileWidth;
    this.gameBoardWidth = this.props.tileWidth * 40;
    this.tileCashMapArray = this.props.gameBoard.map(x => x.hasCache ? 1 : 0);
    this.tileBlessedCashMapArray = this.props.gameBoard.map(x => x.hasBlessedCache ? 1 : 0);
    this.tileDesecratedCashMapArray = this.props.gameBoard.map(x => x.hasDesecratedCache ? 1 : 0);
    this.tileDecorMapArray = this.props.gameBoard.map(x => (!this.props.isHuman) ? x.imageDecorKey : 0);
    this.tileMapArray = this.props.gameBoard.map(a => this.props.isHuman ? ((a.isRevealed || a.isSemiRevealed) ? a.imageKey : 0) : a.imageKey);
    this.state = {
      finishedUpdatingFogMap: this.props.boardFinished,
      tileMapArray: this.tileMapArray,
      tileCashMapArray: this.tileCashMapArray,
      tileBlessedCashMapArray: this.tileBlessedCashMapArray,
      tileDesecratedCashMapArray: this.tileDesecratedCashMapArray,
      tileDecorMapArray: this.tileDecorMapArray,
      tileWidth: this.props.tileWidth,
    };
  }

  componentWillMount() {
    console.log('board componentWillMount');
    console.log(this.state.tileMapArray);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let newTileCashMapArray = nextProps.gameBoard.map(x => x.hasCache ? 1 : 0);
    let newTileBlessedCashMapArray = nextProps.gameBoard.map(x => x.hasBlessedCache ? 1 : 0);
    let newTileDesecratedCashMapArray = nextProps.gameBoard.map(x => x.hasDesecratedCache ? 1 : 0);
    let newTileDecorMapArray = nextProps.gameBoard.map(x => (!this.props.isHuman) ? x.imageDecorKey : 0);
    let newTileMapArray = nextProps.gameBoard.map(a => this.props.isHuman ? ((a.isRevealed || a.isSemiRevealed) ? a.imageKey : 0) : a.imageKey);
    if (JSON.stringify(this.state.tileMapArray) !== JSON.stringify(newTileMapArray)) {
      this.setState({
        tileMapArray: newTileMapArray,
      });
    }
    if (JSON.stringify(this.state.tileCashMapArray) !== JSON.stringify(newTileCashMapArray)) {
      this.setState({
        tileCashMapArray: newTileCashMapArray,
      });
    }
    if (JSON.stringify(this.state.tileDesecratedCashMapArray) !== JSON.stringify(newTileDesecratedCashMapArray)) {
      this.setState({
        tileDesecratedCashMapArray: newTileDesecratedCashMapArray,
      });
    }
    if (JSON.stringify(this.state.tileBlessedCashMapArray) !== JSON.stringify(newTileBlessedCashMapArray)) {
      this.setState({
        tileBlessedCashMapArray: newTileBlessedCashMapArray,
      });
    }
    if (JSON.stringify(this.state.tileDecorMapArray) !== JSON.stringify(newTileDecorMapArray)) {
      this.setState({
        tileDecorMapArray: newTileDecorMapArray,
      });
    }
    if (this.state.tileWidth !== nextProps.tileWidth) {
      // console.log("new tileWidthSet");
      this.setState({
        tileWidth: nextProps.tileWidth,
      });
    }
  }

  getIndexFromTile = (tile) => {
    let { size } = tile;
    let x = tile.left / size;
    let y = tile.top / size;
    let index = (y * 40) + x;
    return index;
  }

  fixImageStyle = (index, tile) => {
    return ({ left: ((index - 1) * this.state.tileWidth), overflow: 'hidden' });
  }

  renderTile = (tile, src, styles) => {
    return (<Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-3.gif")} />);
    // switch (tile.index) {
    //   // wall top northwest
    //   case 1:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-nw.gif")} />;
    //   // wall top north
    //   case 2:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-n.gif")} />;
    //     // wall top northeast
    //   case 3:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-ne.gif")} />;
    //   // // wall top west
    //   case 4:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-w.gif")} />;
    //   // // wall top east
    //   case 5:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-e.gif")} />;
    //   // wall top southwest
    //   case 6:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-sw.gif")} />;
    //   // wall top south
    //   case 7:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-s.gif")} />;
    //   // wall top southeast
    //   case 8:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-se.gif")} />;
    //   // wall top center
    //   case 9:
    //   // console.log("tile", tile);
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-c.gif")} />;
    //   // wall front northwest
    //   case 10:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-nw-2.gif")} />;
    //   // wall front north
    //   case 11:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-n-1.gif")} />;
    //   // wall front northeast
    //   case 12:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-ne-2.gif")} />;
    //   // wall front southwest
    //   case 13:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-sw-2.gif")} />;
    //   // wall front south
    //   case 14:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-s-1.gif")} />;
    //   // wall front southeast
    //   case 15:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-se-2.gif")} />;
    //   // wall front last two rows
    //   case 16:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-f-n-3.gif")} />;
    //   // floor tile northwest
    //   case 17:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-nw.gif")} />;
    //   // floor tile north
    //   case 18:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-n-1.gif")} />;
    //   // floor tile northeast
    //   case 19:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-ne.gif")} />;
    //   // floor tile west
    //   case 20:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-w-1.gif")} />;
    //   // floor tile east
    //   case 21:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-e-1.gif")} />;
    //   // floor tile center
    //   case 22:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-1.gif")} />;
    //   // wall top north/south
    //   case 23:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-n-s.png")} />;
    //   // wall top east/west
    //   case 24:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-e-w.png")} />;
    //   // wall top cap north/south/west -- typo in image name -- this is correct image!!
    //   case 25:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-n-s-e.png")} />;
    //   // wall top cap north/south/east -- typo in image name -- this is correct image!!
    //   case 26:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-n-s-w.png")} />;
    //   // wall top cap north/east/west
    //   case 27:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-n-e-w.png")} />;
    //   // wall top cap east/south/west
    //   case 28:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/wall-t-e-s-w.png")} />;
    //   // floor tile north 2
    //   case 29:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-n-2.gif")} />;
    //   // floor tile north 3
    //   case 30:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-n-3.gif")} />;
    //   // floor tile west 2
    //   case 31:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-w-2.gif")} />;
    //   // floor tile east 2
    //   case 32:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-e-2.gif")} />;
    //   // floor tile center 5
    //   case 33:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-5.gif")} />;
    //   // floor tile center 6
    //   case 34:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-6.gif")} />;
    //   // floor tile center 7
    //   case 35:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-7.gif")} />;
    //   // floor tile center 2
    //   case 36:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-2.gif")} />;
    //   // floor tile center 3
    //   case 37:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-3.gif")} />;
    //   // floor tile center 4
    //   case 38:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-4.gif")} />;
    //   // floor tile center 8
    //   case 39:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-8.gif")} />;
    //   // floor tile center 9
    //   case 40:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-c-9.gif")} />;
    //   // floor tile e2n
    //   case 41:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-e2n.gif")} />;
    //   // floor tile w2n
    //   case 42:
    //     return <Image resizeMode="stretch" style={[styles, this.fixImageStyle()]} source={require("../data/images/floor-w2n.gif")} />;
    //   default:
    //     console.log('the imageKey for this tile was not assigned correctly', tile);
    //     break;
    // }
  };

  renderDecorTile = (tile, src, styles) => {
    switch (tile.index) {
      case 1:
        return <Image resizeMode="contain" style={[styles, { height: (this.state.tileWidth * 1.8), top: -this.state.tileWidth * 0.6, overflow: 'hidden' }]} source={require("../data/images/tube1.png")} />;
        break;
      case 2:
        return <Image resizeMode="contain" style={[styles, { height: (this.state.tileWidth * 2), top: -this.state.tileWidth * 0.7, overflow: 'hidden' }, this.fixImageStyle()]} source={require("../data/images/tube2.png")} />;
        break;
      default:
        console.log('the imageKey for this tile was not assigned correctly', tile);
        break;
    }
  };

  renderBasement = () => {
    if (this.state.finishedUpdatingFogMap) {
      return (
        <View>
          <TileMap
            src={require("../data/images/Black_square.jpeg")}
            tileSize={this.state.tileWidth}
            columns={40}
            rows={40}
            sourceWidth={this.state.tileWidth}
            layers={[this.state.tileMapArray]}
            renderTile={this.renderTile}
          />
        </View>
      );
    }
  }


  // return (
  //   <TileMap
  //     src={require("../data/images/shrine.png")}
  //     tileSize={this.state.tileWidth}
  //     columns={40}
  //     rows={40}
  //     sourceWidth={this.state.tileWidth}
  //     layers={[this.tileCashMapArray]}
  //     renderTile={(tile, src, styles) => (
  //       <Image
  //         resizeMode="stretch"
  //         style={[styles, { height: (this.state.tileWidth * 2), top: -this.state.tileWidth, overflow: 'hidden' }]}
  //         source={src}
  //       />
  //     )}
  //   />
  // );

  renderShrines = () => {
    if (this.props.isHuman) {
      return (
        <TileMap
          src={require("../data/images/shrineShort.png")}
          tileSize={this.state.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.state.tileWidth}
          layers={[this.state.tileCashMapArray]}
          renderTile={(tile, src, styles) => (
            <Image
              resizeMode="contain"
              style={[styles, { height: (this.state.tileWidth*1.5), top: -this.state.tileWidth*0.5, overflow: 'hidden', zIndex: 2 }]}
              source={src}
            />
          )}
        />
      );
    }
  }

  renderBlessedShrines = () => {
    if (this.props.isHuman) {
      return (
        <TileMap
          src={require("../data/images/shrineBlessed.png")}
          tileSize={this.state.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.state.tileWidth}
          layers={[this.state.tileBlessedCashMapArray]}
          renderTile={(tile, src, styles) => (
            <Image
              resizeMode="contain"
              style={[styles, { height: (this.state.tileWidth*1.5), top: -this.state.tileWidth*0.5, overflow: 'hidden', zIndex: 2 }]}
              source={src}
            />
          )}
        />
      );
    }
  }


  renderDesecratedShrines = () => {
    // if (this.props.isHuman) {
      return (
        <TileMap
          src={require("../data/images/shrineDesecrated.png")}
          tileSize={this.state.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.state.tileWidth}
          layers={[this.state.tileDesecratedCashMapArray]}
          renderTile={(tile, src, styles) => (
            <Image
              resizeMode="contain"
              style={[styles, { height: (this.state.tileWidth*1.5), top: -this.state.tileWidth*0.5, overflow: 'hidden', zIndex: 2 }]}
              source={src}
            />
          )}
        />
      );
    // }
  }


  renderDecorations = () => {
    return (
      <TileMap
        // src={require("../data/images/tube1.png")}
        tileSize={this.state.tileWidth}
        columns={40}
        rows={40}
        sourceWidth={this.state.tileWidth}
        layers={[this.state.tileDecorMapArray]}
        renderTile={this.renderDecorTile}
      />
    );
  }

  render() {
    return (
      <View style={{ overflow: 'hidden' }}>

        <Text style={{color: '#fff'}}>ifgosijfgfifljg</Text>

        {this.renderBasement()}


      </View>
    );
  }
  // {this.renderShrines()}
  // {this.renderBlessedShrines()}
  // {this.renderDesecratedShrines()}
  // {this.renderDecorations()}
}
