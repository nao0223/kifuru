use strict;
use IO::File;

sub html2js{
	my ($inPath,$outPath)		= @_;
	my $inF		= new IO::File($inPath);
	my $outF	= new IO::File($outPath,'w');
	while(my $line = $inF->getline()){
		chomp($line);
		$line =~ s/'/\\'/;
		$outF->print("document.write('$line');\n");
	}
	$outF->close();
	$inF->close();
	print("convert : $inPath -> $outPath\n");
}

sub convAll{
	my @files		= glob("*.html");
	foreach my $path(@files){
		my $outPath		= $path;
		$outPath		=~ s/html$/js/;
		html2js($path,$outPath);
	}
}

convAll();

