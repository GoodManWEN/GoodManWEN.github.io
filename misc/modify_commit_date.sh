git filter-branch -f  \
   --env-filter 'if [ $GIT_COMMIT = eaaf5577f402c0a8b10f0604dfa0d29558b2a4e2 ]
    then
        export GIT_AUTHOR_DATE="2021-01-01 00:00:00"
        export GIT_COMMITTER_DATE="2021-01-01 00:00:00"
    elif [ $GIT_COMMIT =  815bb0121c3fc96cc5529eb4c8b3990cd10f9113 ]
    then
        export GIT_AUTHOR_DATE="2016-08-25 00:00:00"
        export GIT_COMMITTER_DATE="2016-08-25 00:00:00"
    fi'