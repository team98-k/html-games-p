package com.game.team1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.game.team1.service.GameInfoService;
import com.game.team1.vo.GameInfoVO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class GameInfoController {
    @Autowired
    private GameInfoService gameService;

    @GetMapping("/game-infos")
    public List<GameInfoVO> getGameInfos(GameInfoVO user) {
        return gameService.getGameInfos(user);
    }

    @GetMapping("/game-infos/{giNum}")
    public GameInfoVO getGameInfo(@PathVariable int giNum) {
        log.info("giNum=>{}", giNum);
        return gameService.getGameInfo(giNum);
    }
    // @PostMapping("/game-infos")
    // public int insertGameInfo(@RequestBody GameInfoVO user) {
    // return gameService.insertGameInfo(user);
    // }
    // @PutMapping("/-infos")
    // public int updateGameInfo(@RequestBody GameInfoVO user) {
    // return gameService.updateGameInfo(user);
    // }
    // @DeleteMapping("/game-infos/{giNum}")
    // public int deleteUserInfo(@PathVariable int giNum) {
    // log.info("giNum=>{}", giNum);
    // return gameService.deleteGameInfo(giNum);
    // }

}
