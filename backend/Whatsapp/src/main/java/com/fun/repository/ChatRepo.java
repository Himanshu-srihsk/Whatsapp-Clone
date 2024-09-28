package com.fun.repository;

import com.fun.model.Chat;
import com.fun.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepo extends JpaRepository<Chat, Integer> {
    @Query("select c from Chat c join c.users u where u.id =:userId")
    public List<Chat> findChatByUserid(@Param("userId") Integer userId);
//    @Query("select c from Chat where c.isGroup=false and :user Member of c.users and :reqUser Member of c.users")
//    public Chat findSingleChatByUserIds(@Param("user") User user, @Param("reqUser") User reqUser);

    @Query("select c from Chat c join c.users u1 join c.users u2 where c.isGroup=false and u1 = :user and u2 = :reqUser")
    public Chat findSingleChatByUserIds(@Param("user") User user, @Param("reqUser") User reqUser);

}
