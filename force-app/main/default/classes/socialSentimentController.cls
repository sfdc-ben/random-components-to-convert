public with sharing class socialSentimentController {
    @AuraEnabled
    public static list<SocialPost> getSocialPosts(String caseId){
        system.debug(caseId);
        list<SocialPost> casePosts = [SELECT Id, AnalyzerScore, KeywordGroupName FROM SocialPost
                WHERE ParentId = :caseId AND IsOutbound = false ORDER BY POSTED DESC];
        system.debug(casePosts);
        return casePosts;
    }
}
