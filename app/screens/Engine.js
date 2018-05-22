import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dimensions, Image, View, PanResponder, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Loop, Stage, TileMap, Sprite } from "react-game-kit/native";

import Board from "./Board";

export default class Engine extends Component {
  static propTypes = {
    gameBoard: PropTypes.array,
    tilesInRow: PropTypes.number,
    boardFinished: PropTypes.bool,
    playerSpace: PropTypes.object,
    isHuman: PropTypes.bool,
    move: PropTypes.func,
    tileWidth: PropTypes.number,
    incrementTurnCounter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    // console.log("Engine");
    this.screenDimensions = Dimensions.get("window");
    this.gameBoardWidth = this.props.tileWidth * 40;
    this.xOffsetMax = this.gameBoardWidth - this.screenDimensions.width;
    this.yOffsetMax = this.gameBoardWidth - this.screenDimensions.height;
    this.playerX = (this.props.playerSpace.name % 40) * this.props.tileWidth;
    this.playerY = Math.floor(this.props.playerSpace.name / 40) * this.props.tileWidth;
    this.cameraX = this.playerX - this.screenDimensions.width/2;
    this.cameraY = this.playerY - this.screenDimensions.height/2;
    this.beginningX = this.getBeginningX();
    this.beginningY = this.getBeginningY();
    this.highlightedTileRanges = [];
    this.state = {
      playerSpace: this.props.playerSpace,
      playerX: this.playerX,
      playerY: this.playerY,
      isZooming: false,
      isMoving: false,
      initialX: null,
      offsetLeft: 0,
      initialTop: 0,
      initialLeft: 0,
      top: this.beginningY,
      left: this.beginningX,
      highlightedTileMap: this.props.gameBoard.map(x => x.isHighlighted ? 1 : 0),
      showHighlighted: false,
      fogMap: this.props.gameBoard.map(a => a.isRevealed ? 0 : 1),
      spritePlaying: true,
      spriteScale: this.props.tileWidth / this.props.zoomedInValue,
      wasPouncedTileMap: this.props.gameBoard.map(a => a.wasPounced ? 1 : 0),
      wasEchoedTileMap: this.props.gameBoard.map(a => a.wasEchoed ? 1 : 0),
    };
  }

  getBeginningX = () => {
    if (this.cameraX < 0) {
      return 0;
    } else if (this.cameraX > this.xOffsetMax) {
      return -this.xOffsetMax;
    } else {
      return -this.cameraX;
    }
  }

  getBeginningY = () => {
    if (this.cameraY < 0) {
      return 0;
    } else if (this.cameraY > this.yOffsetMax) {
      return -this.yOffsetMax;
    } else {
      return -this.cameraY;
    }
  }

  componentWillMount() {
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(this.props.isHuman);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {

      },
      onPanResponderMove: (evt, gestureState) => {
        let { touches } = evt.nativeEvent;
        // let { touches } = evt.nativeEvent;
        if (touches.length === 2 && (Math.abs(touches[0].pageX - touches[1].pageX) > 5)) {
          this.processPan(touches[0].pageX, touches[0].pageY);
        } else if (this.state.showHighlighted && touches.length === 1) {
          this.processMove(touches[0].pageX, touches[0].pageY);
        }
      },
      onPanResponderRelease: () => {
        // console.log("on pan responder release");
        this.setState({
          isMoving: false,
        });
      }
    });
  }

  componentDidUpdate() {
    // console.log(this.state.left, this.state.top);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('engine received props');
    let newHighlightedTileMap = nextProps.gameBoard.map(x => x.isHighlighted ? 1 : 0);
    let newFogMap = nextProps.gameBoard.map(x => x.isRevealed ? 0 : 1);
    if (this.props.playerSpace !== nextProps.playerSpace) {
      // console.log("player space", this.props.playerSpace, nextProps.playerSpace)
      this.setState({
        playerSpace: nextProps.playerSpace,
        playerX: (nextProps.playerSpace.name % 40) * this.props.tileWidth,
        playerY: Math.floor(nextProps.playerSpace.name / 40) * this.props.tileWidth,
      });
    }
    if (JSON.stringify(this.state.highlightedTileMap !== newHighlightedTileMap)) {
      this.setState({
        highlightedTileMap: newHighlightedTileMap,
      });
      if (newHighlightedTileMap.includes(1)) {
        this.setState({
          showHighlighted: true,
        });
      } else {
        this.setState({
          showHighlighted: false,
        });
      }
    }
    if (JSON.stringify(this.state.fogMap) !== JSON.stringify(newFogMap)) {
      this.setState({
        finishedUpdatingFogMap: false,
        fogMap: newFogMap,
      });
    }
  }

  processPan(x, y) {
    if (!this.state.isMoving) {
      this.setState({
        isMoving: true,
        initialX: x,
        initialY: y,
        initialTop: this.state.top,
        initialLeft: this.state.left,
      });
    } else {
      let left = this.state.initialLeft + x - this.state.initialX;
      let top = this.state.initialTop + y - this.state.initialY;
      // console.log(left, this.gameBoardWidth);
      this.setState({
          left:
            left > 0 ?
            0 :
              left < (-this.gameBoardWidth + this.screenDimensions.width) ?
                (-this.gameBoardWidth + this.screenDimensions.width) :
                left,
          top:
            top > 0 ?
            0 :
              top < (-this.gameBoardWidth + this.screenDimensions.height) ?
                (-this.gameBoardWidth + this.screenDimensions.height) :
                top,
        });
    }
  }

  processMove(touchX, touchY) {
    let x = touchX - this.state.left;
    let y = touchY - this.state.top;
    // console.log("process move", this.highlightedTileRanges, touchX, touchY, x, y, this.state.left, this.state.top);
    for (let i = 0; i < this.highlightedTileRanges.length; i++) {
      if (
        x > this.highlightedTileRanges[i].xMin &&
        x < this.highlightedTileRanges[i].xMax &&
        y > this.highlightedTileRanges[i].yMin &&
        y < this.highlightedTileRanges[i].yMax
      ) {
        let newPlayerTile = this.getTileFromXY(x, y);
        this.props.move(newPlayerTile);
        this.props.incrementTurnCounter();
      }
    }
  }

  getTileFromXY(x, y) {
    y = Math.floor(y/this.props.tileWidth);
    x = Math.floor(x/this.props.tileWidth);
    let index = ((y * 40) + x);
    // console.log(this.state.playerSpace.name, index, this.state.playerX, this.state.playerY);
    return (this.props.gameBoard[index]);
  }

  getRangesFromTile = (tile) => {
    let { size, top, left } = tile;
    return ({ xMin: left, xMax: (left + size), yMin: top, yMax: (top + size) });
  }

  renderHighlighted = () => {
    if (this.state.showHighlighted) {
      return (
        <TileMap
          src={require("../data/images/Magenta-square_100px.gif")}
          tileSize={this.props.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.props.tileWidth}
          layers={[this.state.highlightedTileMap]}
          renderTile={(tile, src, styles) => {
            this.highlightedTileRanges.push(this.getRangesFromTile(tile));
            return (
              <TouchableOpacity style={[styles]}>
                <Image
                  resizeMode="stretch"
                  style={[styles, { opacity: 0.1 }]}
                  source={src}
                />
              </TouchableOpacity>
            );
            }
          }
        />
      );
    } else {
      this.highlightedTileRanges = [];
    }
  };

  renderLastTurn = () => {
    if (this.props.isHuman) {
      return (
        <TileMap
          src={require("../data/images/greensquare.jpg")}
          tileSize={this.props.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.props.tileWidth}
          layers={[this.state.wasPouncedTileMap]}
          renderTile={(tile, src, styles) => {
            return (
              <TouchableOpacity style={[styles]}>
                <Image
                  resizeMode="stretch"
                  style={[styles, { opacity: 0.1 }]}
                  source={src}
                />
              </TouchableOpacity>
            );
            }
          }
        />
      );
    } else if (!this.props.isHuman) {
      return (
        <TileMap
          src={require("../data/images/greensquare.jpg")}
          tileSize={this.props.tileWidth}
          columns={40}
          rows={40}
          sourceWidth={this.props.tileWidth}
          layers={[this.state.wasEchoedTileMap]}
          renderTile={(tile, src, styles) => {
            return (
              <TouchableOpacity style={[styles]}>
                <Image
                  resizeMode="stretch"
                  style={[styles, { opacity: 0.1 }]}
                  source={src}
                />
              </TouchableOpacity>
            );
            }
          }
        />
      );
    }
  }

  render() {
    return (
      <Loop>
        <Stage
          height={this.screenDimensions.height}
          width={this.screenDimensions.width}
          style={{ backgroundColor: "#000" }}
        >
          <View style={{width: this.screenDimensions.width, height: this.screenDimensions.height, zIndex: 1}} {...this._panResponder.panHandlers}>
            <View style={{ position: 'absolute', left: this.state.left, top: this.state.top, width: this.gameBoardWidth, height: this.gameBoardWidth }} >
              <Board
                gameBoard={this.props.gameBoard}
                isHuman={this.props.isHuman}
                boardFinished={this.props.boardFinished}
                tileWidth={this.props.tileWidth}
              />

              {/* <Image style={{ position: 'absolute', top: (this.state.playerY - this.props.tileWidth), left: this.state.playerX, height: (this.props.tileWidth * 6), width: (this.props.tileWidth * 3), resizeMode: 'contain' }} source={require("../data/images/monsterIdle.gif")} /> */}
              {this.renderHighlighted()}
              {this.renderLastTurn()}
              <Sprite
                offset={[0,0]}
                repeat={true}
                src={require("../data/images/monsterMoveIdle.png")}
                steps={[11, 11, 11, 11]}
                state={0}
                onPlayStateChanged={this.handlePlayStateChanged}
                tileHeight={150}
                ticksPerFrame={10}
                tileWidth={150}
                style={this.getSpriteStyle()}
              />

            </View>
          </View>
        </Stage>
      </Loop>
    );
  }

  getSpriteStyle = () => {
    if (this.props.tileWidth === this.props.zoomedInValue) {
      return ({ left: this.state.playerX - Math.ceil((this.props.tileWidth - 4)), top: this.state.playerY - ((this.props.tileWidth*2 + 4)), transform: [{scale: this.state.spriteScale}] });
    } else if (this.props.tileWidth === this.props.zoomedOutValue) {
      return ({ left: this.state.playerX - Math.ceil((this.props.tileWidth - 4)/(this.state.spriteScale/1.6)), top: this.state.playerY - (this.props.tileWidth*4.3), transform: [{scale: this.state.spriteScale}] });
    }
  }

  handlePlayStateChanged = (state) => {
    this.setState({
      spritePlaying: state ? true : false,
    });
  }

}
