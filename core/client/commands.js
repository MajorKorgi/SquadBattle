RegisterCommand("stats", async () => {
    showStats = !showStats
})

RegisterCommand("blub", async (source) => {
    //PlaySoundFrontend(-1, "BASE_JUMP_PASSED", "HUD_AWARDS", 1)
    PlaySoundFrontend(-1, "10_SEC_WARNING", "HUD_MINI_GAME_SOUNDSET", 1)
})