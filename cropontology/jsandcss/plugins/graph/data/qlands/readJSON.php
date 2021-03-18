<?php
    $json   = json_decode(file_get_contents("objects_final.json"), true);
    $data   = array();
    $errors = array();

    foreach ($json as $obj) {
        $data[$obj['name']] = $obj;
    }

    foreach ($data as &$obj) {
        $obj['dependedOnBy'] = array();
    }
    unset($obj);
    foreach ($data as &$obj) {
/*
        foreach ($obj['depends'] as $name) {
            if ($data[$name]) {
                $data[$name]['dependedOnBy'][] = $obj['name'];
            } else {
                $errors[] = "Unrecognized dependency: '$obj[name]' depends on '$name'";
            }
			   }
*/
        foreach ($obj['depends'] as $name) {
					$depitem = (object) [
						'name' => $name['name'],
						'type' => $name['type']
					];
					print_r($depitem);
					print "<br />";
					array_push($obj['dependedOnBy'], $depitem);
				}
				
				print_r($obj['dependedOnBy']);
				print "<br />---<br />";
			   //echo $data[$name]['dependedOnBy'];
    }
    unset($obj);
    foreach ($data as &$obj) {
        $obj['docs'] = get_html_docs($obj);
    }
    unset($obj);
?>