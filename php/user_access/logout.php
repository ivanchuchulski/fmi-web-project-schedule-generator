<?php

function logout() {
	try {
		if (!session_unset()) {
			throw new Exception('грешка : session_unset');
		}

		if (!session_destroy()) {
			throw new Exception('грешка : session_destroy');
		}

		$response = ['success' => true];
		echo json_encode($response);
	}
	catch (Exception $exception) {
		$response = ['success' => false, 'error' => $exception->getMessage()];
		echo json_encode($response);
	}
}

?>