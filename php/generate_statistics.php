<?php

require_once "statistics.php";

function generateStatistics()
{

    try {
        checkSessionSet();

        $stats = [];
        $statistics = new Statistics();

        $stats += $statistics->getNumberOfUsers();
        $stats += $statistics->getNumberOfPresentations();
        $stats += $statistics->getNumberOfPreferences();

        $stats += $statistics->getMaxNumberOfPreferencesFromAllUsers();
        if (is_null($stats['maxNumberOfPreference'])) {
            $stats['maxNumberOfPreference'] = 0;
        }

        $stats += $statistics->getAverageNumberOfPreferences();
        if (is_null($stats['averageNumberOfPreference'])) {
            $stats['averageNumberOfPreference'] = 0;
        }

        $stats += $statistics->getMostPreferredPresentation();
        if (is_null($stats['mostPreferredPresentation'])) {
            $stats['mostPreferredPresentation'] = 0;
        }

        $topFivePresentations = $statistics->getTopFivePresentations();

        $response = ['success' => true, 'data' => $stats, 'topFivePresentations' => $topFivePresentations];
        echo json_encode($response);
    } catch (Exception $exception) {
        $response = ['success' => false, 'error' => $exception->getMessage()];
        echo json_encode($response);
    }

}

?>