package com.game.team1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.game.team1.service.PointInfoService;
import com.game.team1.vo.MsgVO;
import com.game.team1.vo.PointInfoVO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class PointInfoController {
    @Autowired
    private PointInfoService pointInfoService;

    @GetMapping("/point-infos/{giNum}")
    public List<PointInfoVO> getPointInfos(PointInfoVO point, @PathVariable int giNum) {
        point.setGiNum(giNum);
        log.info("point=>{}", point);
        return pointInfoService.getPointInfos(point);
    }

    // @GetMapping("/point-infos/{piNum}")
    // public PointInfoVO getPointInfo(@PathVariable int piNum) {
    // return pointInfoService.getPointInfo(piNum);
    // }

    @PostMapping("/point-infos")
    public MsgVO insertPointInfo(@RequestBody PointInfoVO point, MsgVO msg) {
        try {
            int insertPointInfo = pointInfoService.insertPointInfo(point);
            if (insertPointInfo == 1) {
                msg.setMsg("점수가 저장되었습니다.");
                msg.setUrl(("/"));
                msg.setSuccess(true);
            }
        } catch (Exception e) {
            msg.setMsg("오류가 발생했습니다.");
        }
        return msg;
    }

    @PutMapping("/point-infos")
    public int updatePointInfo(@RequestBody PointInfoVO point) {
        return pointInfoService.updatePointInfo(point);
    }

    @DeleteMapping("/point-infos/{piNum}")
    public int deletePointInfo(@PathVariable int piNum) {
        return pointInfoService.deletePointInfo(piNum);
    }
}